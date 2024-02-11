import { Card } from "./card";
import { State } from "./state";

export class CardList {
  constructor(owner, type, title) {
    this.container = owner.container;
    this.type = type;
    this.cards = new Map();
    this.list = this.create(type, title);
    this.cardContainer = this.list.querySelector(".card-list-container");
    this.cardAddElement = this.list.querySelector(".card-add");
    this.cardAddLink = this.list.querySelector(".card-add-link");
    this.formAdd = this.list.querySelector(".form-add");
    this.newCardForm = this.list.querySelector(".new-card");
    this.cardTitleField = this.newCardForm.querySelector(".addcard");
    this.submitButton = this.list.querySelector(".btn-add");
    this.cancelButton = this.list.querySelector(".btn-cancel");

    this.addListeners();

    this.storage = new State(type);
    this.loadCards();
  }

  create(type, title) {
    const cardList = document.createElement("section");
    cardList.classList.add("card-list");
    cardList.setAttribute("name", `${type}`);

    cardList.innerHTML = `
      <div class="card-list-title">${title}</div>
      <div class="card-list-container"></div>
      <form class="form-add" novalidate>
        <div class="card-add">
          <p class="card-add-p">+
            <a class="card-add-link" href="#0">Добавить карточку</a>
          </p>
        </div>
        <div class="new-card hidden"> 
          <div class="card-add-control">
              <textarea class="input addcard" placeholder="Введите заголовок карточки"></textarea>
          </div>
          <div class="form-buttons">
            <button type="submit" class="btn-add">Добавить</button>
            <button type="reset" class="btn-cancel">&#10005</button>
          </div>
        </div>
      </form>`;

    return this.container.appendChild(cardList);
  }

  showNewCardForm(show) {
    if (show) {
      this.cardAddElement.classList.add("hidden");
      this.newCardForm.classList.remove("hidden");
    } else {
      this.cardAddElement.classList.remove("hidden");
      this.newCardForm.classList.add("hidden");
    }
  }

  addListeners() {
    this.cardAddLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.showNewCardForm(true);
      this.cardTitleField.value = "";
      this.cardTitleField.focus();
    });

    this.submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      const cardTitleValue = this.cardTitleField.value.trim();
      if (cardTitleValue != "") {
        this.insertCard(cardTitleValue);
        this.saveCards();
        this.showNewCardForm(false);
      } else {
        alert("Надо заполнить текст карточки!");
      }
    });

    this.cancelButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.showNewCardForm(false);
    });
  }

  insertCard(cardTitle, relativeEl = null) {
    const newCard = new Card(this, cardTitle, relativeEl);
    this.cards.set(newCard.id, newCard);
    this.saveCards();
    return newCard;
  }

  removeCard(cardEl) {
    const card = this.cards.get(cardEl.id);
    card.remove();
    this.cards.delete(cardEl.id);
    this.saveCards();
  }

  insertStub(container, relativeEl, width, height) {
    const cardEl = document.createElement("div");
    cardEl.classList.add("stub");
    let newStub = null;
    if (relativeEl) {
      newStub = container.insertBefore(cardEl, relativeEl);
    } else {
      newStub = container.appendChild(cardEl);
    }
    newStub.style.width = width + "px";
    newStub.style.height = height + "px";
    return newStub;
  }

  loadCards() {
    try {
      const cardTitles = this.storage.load();
      if (cardTitles) {
        cardTitles.forEach((el) => {
          this.insertCard(el);
        });
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  saveCards() {
    const cardTitles = [];
    const cardTitlesElements = Array.from(
      this.cardContainer.querySelectorAll(".card-title")
    );
    cardTitlesElements.forEach((el) => {
      cardTitles.push(el.textContent);
    });

    if (cardTitles.length > 0) {
      this.storage.save(cardTitles);
    } else {
      this.storage.clear();
    }
  }
}
