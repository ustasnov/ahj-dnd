/* eslint-disable no-unused-vars */

export class Card {
  constructor(owner, title, relativeEl) {
    this.owner = owner;
    this.container = owner.cardContainer;
    this.id = crypto.randomUUID();
    this.title = title;
    this.card = this.create(relativeEl);

    const deleteButton = this.card.querySelector(".card-delete-button");
    deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.remove();
      this.owner.cards.delete(this.id);
      this.owner.saveCards();
    });

    this.card.addEventListener("mouseover", (e) => {
      deleteButton.classList.remove("hidden");
    });

    this.card.addEventListener("mouseout", (e) => {
      deleteButton.classList.add("hidden");
    });
  }

  create(relativeEl) {
    const cardEl = document.createElement("article");
    cardEl.classList.add("card");
    cardEl.id = this.id;

    cardEl.innerHTML = `
      <div class="card-title">${this.title}</div>
      <div class="card-delete">
        <button class="card-delete-button hidden" type="button">&#10005</button>
      </div>`;

    let newCard = null;
    if (relativeEl) {
      newCard = this.container.insertBefore(cardEl, relativeEl);
    } else {
      newCard = this.container.appendChild(cardEl);
    }

    return newCard;
  }

  remove() {
    this.card.remove();
  }
}
