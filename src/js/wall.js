/* eslint-disable no-unused-vars */

import { CardList } from "./cardlist";

export class Wall {
  constructor() {
    this.container = document.querySelector(".wall");
    this.cardLists = new Map([
      ["todo", new CardList(this, "todo", "Что сделать")],
      ["inprogress", new CardList(this, "inprogress", "Выполняется")],
      ["done", new CardList(this, "done", "Выполнено")],
    ]);
    this.sourceCard = null;
    this.startRelativeEl = null;
    this.startCardList = null;
    this.dropTargetEl = null;
    this.draggedEl = null;
    this.stubEl = null;
    this.coord = { shiftY: 0, shiftX: 0 };

    this.addListeners();
  }

  getCardListByElement(element) {
    let result = null;
    const el = element.closest(".card-list");
    if (el) {
      const name = el.getAttribute("name");
      result = this.cardLists.get(name);
    }
    return result;
  }

  restoreSourceCard() {
    if (this.sourceCard) {
      this.startCardList.insertCard(
        this.sourceCard.title,
        this.startRelativeEl
      );
      this.startRelativeEl = null;
      this.sourceCard = null;
      this.startCardList = null;
    }
  }

  setGrabbingCursor() {
    const all = Array.from(document.body.getElementsByTagName("*"));
    all.forEach((el) => {
      if (!el.classList.contains("grab")) {
        el.classList.add("grab");
      }
    });
  }

  unsetGrabbingCursor() {
    const all = Array.from(document.body.getElementsByTagName("*"));
    all.forEach((el) => {
      if (el.classList.contains("grab")) {
        el.classList.remove("grab");
        if (el.classList.contains("card")) {
          el.style.cursor = "grab";
        }
      }
    });
  }

  addListeners() {
    const onMouseDownHandler = this.onMouseDown.bind(this);
    this.container.addEventListener("mousedown", onMouseDownHandler);

    const onMouseMoveHandler = this.onMouseMove.bind(this);
    this.container.addEventListener("mousemove", onMouseMoveHandler);

    const onMouseLeave = this.onMouseLeave.bind(this);
    this.container.addEventListener("mouseleave", onMouseLeave);

    const onMouseUp = this.onMouseUp.bind(this);
    this.container.addEventListener("mouseup", onMouseUp);
  }

  onMouseDown(e) {
    if (
      e.target.classList.contains("card") ||
      e.target.parentNode.classList.contains("card")
    ) {
      e.preventDefault();
      const currentCardEl = e.target.classList.contains("card")
        ? e.target
        : e.target.parentNode;
      const currentCardList = this.getCardListByElement(currentCardEl);
      this.sourceCard = currentCardList.cards.get(currentCardEl.id);

      const { top, left, width } = this.sourceCard.card.getBoundingClientRect();
      this.coord.shiftY = e.pageY - top - scrollY;
      this.coord.shiftX = e.pageX - left - scrollX;

      this.startRelativeEl = currentCardEl.nextSibling;
      this.startCardList = currentCardList;
      this.draggedEl = this.sourceCard.card.cloneNode(true);
      this.draggedEl.classList.add("dragged");
      const body = document.querySelector("body");
      this.draggedEl = body.appendChild(this.draggedEl);
      const cardStyle =
        this.sourceCard.card.currentStyle ||
        window.getComputedStyle(this.sourceCard.card, null);
      this.draggedEl.style.width =
        width -
        parseInt(cardStyle.paddingLeft) -
        parseInt(cardStyle.paddingRight) +
        "px";
      this.draggedEl.style.left = left + "px";
      this.draggedEl.style.top = top + "px";

      currentCardList.removeCard(this.sourceCard.card);
      this.setGrabbingCursor();
    }
  }

  onMouseMove(e) {
    if (!this.draggedEl) {
      return;
    }
    e.preventDefault();

    this.draggedEl.style.left = `${e.pageX - this.coord.shiftX}px`;
    this.draggedEl.style.top = `${e.pageY - this.coord.shiftY}px`;

    if (
      e.target.classList.contains("card") ||
      e.target.parentNode.classList.contains("card")
    ) {
      const currentCardEl = e.target.classList.contains("card")
        ? e.target
        : e.target.parentNode;
      const currentCardList = this.getCardListByElement(currentCardEl);
      if (currentCardEl != this.dropTargetEl) {
        if (this.stubEl) {
          this.stubEl.remove();
          this.stubEl = null;
        }
        this.dropTargetEl = currentCardEl;
        this.stubEl = currentCardList.insertStub(
          this.dropTargetEl.parentNode,
          this.dropTargetEl,
          this.draggedEl.offsetWidth,
          this.draggedEl.offsetHeight
        );
      }
    } else if (e.target.classList.contains("card-add-link")) {
      const currentEl = e.target;
      const currentCardList = this.getCardListByElement(currentEl);
      if (this.stubEl) {
        this.stubEl.remove();
        this.stubEl = null;
      }
      this.dropTargetEl = currentEl;
      this.stubEl = currentCardList.insertStub(
        currentCardList.cardContainer,
        null,
        this.draggedEl.offsetWidth,
        this.draggedEl.offsetHeight
      );
    }
  }

  onMouseLeave(e) {
    this.restoreSourceCard();
    e.target.style.cursor = "auto";
    if (this.stubEl) {
      this.stubEl.remove();
    }
    this.stubEl = null;

    if (this.draggedEl) {
      this.draggedEl.remove();
    }
    this.draggedEl = null;
    this.dropTargetEl = null;
    this.unsetGrabbingCursor();
  }

  onMouseUp(e) {
    if (!this.draggedEl) {
      return;
    }

    if (this.stubEl) {
      const currentCardList = this.getCardListByElement(this.stubEl);
      currentCardList.insertCard(this.sourceCard.title, this.stubEl);
      this.stubEl.remove();
    } else {
      this.restoreSourceCard();
    }

    this.stubEl = null;
    this.sourceCard = null;
    this.startRelativeEl = null;
    this.startCardList = null;

    if (this.draggedEl) {
      this.draggedEl.remove();
    }
    this.draggedEl = null;
    this.dropTargetEl = null;

    this.unsetGrabbingCursor();
  }
}
