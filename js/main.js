"use strict";

// API
/**
 * Create an unique hash code
 * @returns string
 */
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

const studentUrl = "http://localhost:3000/students";
const ul = document.querySelector(".students__list");
const form = document.getElementById("dataForm");
const nameInput = document.querySelector("#name");
const surnameInput = document.querySelector("#surname");
const registerInput = document.querySelector("#register");
const sendBtn = document.querySelector("#sendBtn");
let editPersonId;

/**
 * Get all data from the Server
 * @param url string
 */
const getData = async (url) => {
  let response = await fetch(url);
  let data = await response.json();
  return data;
};

/**
 * Print the list of element got from server
 * @param element - HTMLElement
 * @param items - Array
 */
const printList = async (element, items) => {
  let data = [];
  data = await items;

  data.forEach((element) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const editBtn = document.createElement("span");
    const deleteBtn = document.createElement("span");

    //creating buttons contents
    editBtn.innerHTML = "edit";
    editBtn.classList.add("btn");
    deleteBtn.innerHTML = "Delete";
    deleteBtn.classList.add("btn");
    div.classList.add("student");

    //adding event listeners
    editBtn.addEventListener("click", async (e) => {
      const personId =
        e.target.parentElement.childNodes[3].lastChild.textContent;
      console.log(personId);
      editPersonId = personId;
      const person = await getData(`${studentUrl}?id=${personId}`);
      console.log(person[0]);
      nameInput.value = person[0].name;
      surnameInput.value = person[0].surname;
      registerInput.value = person[0].register;

      sendBtn.textContent = "Edit";
    });

    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const personId =
        e.target.parentElement.childNodes[3].lastChild.textContent;

      //delete the person
      async function deletePerson(personId) {
        await fetch(`${studentUrl}/${personId}`, {
          method: "DELETE",
        })
          .then((res) => {
            // if the post has not succesfull throw and error
            if (!res.ok) {
              throw new Error("The some problem with you request");
            }

            return res.json();
          })
          .then(() => e.target.parentElement.remove());
      }

      return deletePerson(String(personId));
    });

    // Creating paragraph item with the KEYS as string
    Object.keys(element).map((item) => {
      const p = document.createElement("p");
      const span = document.createElement("span");
      span.classList.add("bold");
      span.innerHTML = `${item.toUpperCase()}:  `;
      p.appendChild(span);
      p.innerHTML += element[item];
      div.appendChild(p);
    });
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    li.appendChild(div);
    return ul.appendChild(li);
  });
};

/**
 * Get data from the Form and send them to the server
 */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Creates a new object that contains all the data from the form
  const prePayload = new FormData(form);
  sendBtn.textContent === "Send" && prePayload.append("id", await uuidv4());
  const payload = new URLSearchParams(prePayload);

  fetch(
    sendBtn.textContent === "Send"
      ? studentUrl
      : `${studentUrl}/${editPersonId}`,
    {
      method: sendBtn.textContent === "Send" ? "POST" : "PUT",
      body: payload,
    }
  ).then((res) => {
    // if the post has not success throw and error
    if (!res.ok) {
      throw new Error("The some problem with you request");
    }
    // if the post is success the page will be updates
    sendBtn.textContent === "Send" && printList(ul, getData(url));
    return res.json();
  });
});

/**
 * On page load all the data are retrieved
 */
window.onload = printList(ul, getData(studentUrl));
