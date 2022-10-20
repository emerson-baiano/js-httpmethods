const url = "http://localhost:3000/students";
const container = document.querySelector(".students__list");
const nameInput = document.querySelector("#name");
const surnameInput = document.querySelector("#surname");
const registerInput = document.querySelector("#register");
const sendBtn = document.querySelector("#sendBtn");
const form = document.getElementById("dataForm");
let personId;

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

const getData = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const sendValue = (item) => {
  sendBtn.innerHTML = "EDIT";
  nameInput.value = item.name;
  surnameInput.value = item.surname;
  registerInput.value = item.register;
  personId = item.id;
};

const editData = async (personId) => {
  const prePayload = new FormData(form);
  const payload = new URLSearchParams(prePayload);
  await fetch(`${url}/${personId}`, {
    method: "PUT",
    body: payload,
  });
};

const addData = async () => {
  const prePayload = new FormData(form);
  prePayload.append("id", await uuidv4());
  const payload = new URLSearchParams(prePayload);

  await fetch(url, {
    method: "POST",
    body: payload,
  });
};

sendBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sendBtn.innerHTML === "EDIT" ? editData(personId) : addData();
});

const renderItems = async (arr) => {
  const localArray = await arr;
  localArray.map((item) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    div.classList.add("student");

    //map the object key, to print the Keys in UpperCase.
    Object.keys(item).map((key) => {
      const newElement = `<p><span class="bold">${key.toUpperCase()}:</span> ${
        item[key]
      }</p>`;
      div.innerHTML += newElement;
    });

    const editSpan = document.createElement("span");
    editSpan.innerHTML = "EDIT";
    editSpan.addEventListener("click", () => {
      sendValue(item);
    });

    const deleteSpan = document.createElement("span");
    deleteSpan.innerHTML = "DELETE";
    deleteSpan.addEventListener("click", () => {
      fetch(`${url}/${item.id}`, {
        method: "DELETE",
      });
    });

    div.appendChild(editSpan);
    div.appendChild(deleteSpan);
    li.appendChild(div);
    container.appendChild(li);
  });
};

renderItems(getData(url));
window.document.onload = getData(url);
