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
        e.target.parentElement.childNodes[0].lastChild.textContent;
      const person = await getData(`${studentUrl}?id=${personId}`);
      console.log(person[0]);
      nameInput.value = person[0].name;
      surnameInput.value = person[0].surname;
      registerInput.value = person[0].register;
      // prePayload.append("id", uuidv4());
      // e.target.parentElement.childNodes.forEach((item) =>
      //   console.log(item.lastChild)
      // );
    });
    //TODO: CHANGE BUTTON SEND TO ADD AND CHANGE THE METHOD WHEN CLICKED

    deleteBtn.addEventListener("click", async (e) => {
      const personId =
        e.target.parentElement.childNodes[0].lastChild.textContent;

      async function getPerson(personId) {
        await fetch(`${studentUrl}/${personId}`, {
          method: "DELETE",
        })
          .then((res) => {
            // if the post has not succesfull throw and error
            if (!res.ok) {
              throw new Error("The some problem with you request");
            }
            // if the post is succesfull the page will be updates
            // printList(ul, getData(url));

            return res.json();
          })
          .then(() => e.target.parentElement.remove());
      }

      return getPerson(String(personId));
    });

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
form.addEventListener("submit", (e, url) => {
  e.preventDefault();
  // Creates a new object that conintains all the data from the form
  const prePayload = new FormData(form);
  prePayload.append("id", uuidv4());
  const payload = new URLSearchParams(prePayload);

  fetch(url, {
    method: "POST",
    body: payload,
  }).then((res) => {
    // if the post has not succesfull throw and error
    if (!res.ok) {
      throw new Error("The some problem with you request");
    }
    // if the post is succesfull the page will be updates
    printList(ul, getData(url));
    return res.json();
  });
});

/**
 * On page load all the data are retrieved
 */
window.onload = printList(ul, getData(studentUrl));

// {
//   "students": [
//     {
//       "id": "0bdf3b7b-44ef-458a-b2ff-0b46ba8b5fd2",
//       "name": "Joao",
//       "surname": "Guimaraes",
//       "register": "AAAE"
//     },
//     {
//       "id": "46f1a7ae-63cc-4e34-ac58-a19dfc44bcf0",
//       "name": "Laura",
//       "surname": "Clochobar",
//       "register": "AAAC"
//     },
//     {
//       "id": "46f15cb2-e38d-433e-8d7c-6dc6d7491d63",
//       "name": "Emerson",
//       "surname": "Lopes",
//       "register": "AAAD"
//     },
//     {
//       "id": "48f15cb2-e38d-433e-8d7c-6dc6d7491d63",
//       "name": "Alejandro",
//       "surname": "Ortega",
//       "register": "AAAE"
//     },
//     {
//       "id": "46f15cb2-e88d-433e-8d7c-6dc6d7491d63",
//       "name": "Emanuele",
//       "surname": "Gurini",
//       "register": "AAAE"
//     }
//   ]
// }
