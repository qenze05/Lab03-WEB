document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("form");
    const textInput = document.getElementById("input");
    const addButton = document.getElementById("button");

    // addListButtonsListeners();
    function sendData() {
        addItem(textInput.value);
        textInput.value = "";
        form.submit();

    }

    textInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter" && textInput.value !== "") {
            if(checkForSimilarNames(textInput.value)) return;
            event.preventDefault();
            sendData();
        }
    });

    addButton.addEventListener("click", function () {
        if (textInput.value !== "") {
            if(checkForSimilarNames(textInput.value)) return;
            sendData();
        }
    });

    function addItem(value) {
        let list = document.getElementById("product-list");
        let container = document.getElementById("items-container");
        list.style.height = (list.offsetHeight + 45) + "px";

        let html = "<span>" +
            "<hr class=\"separator\">" +
            "<section id=\"table-element-"+localStorage.length+"\" class=\"table-element\">\n" +
            "        <span id=\"name-"+localStorage.length+"\" class=\"name\">" + value + "</span>\n" +
            "\n" +
            "        <span id=\"amount-container-"+localStorage.length+"\" class=\"amount-container\">\n" +
            "            <button id=\"minus-"+localStorage.length+"\" class=\"minus-circle\" style=\"background-color: #e5a1a1\">-</button>\n" +
            "            <span id=\"amount-"+localStorage.length+"\" class=\"amount\">1</span>\n" +
            "            <button id=\"plus-"+localStorage.length+"\" class=\"plus-circle\">+</button>\n" +
            "        </span>\n" +
            "\n" +
            "        <span id=\"button-container-"+localStorage.length+"\" class=\"button-container\">\n" +
            "            <button id=\"buy-"+localStorage.length+"\" class=\"button fade\" data-tooltip=\"Куплено\">Куплено</button>\n" +
            "            <button id=\"delete-"+localStorage.length+"\" class=\"delete fade\" data-tooltip=\"Видалити продукт\">X</button>\n" +
            "        </span>\n" +
            "    </section>" +
            "</span>"
        container.innerHTML += html;
        // let object = {
        //     name: value,
        //     amount: 1,
        //     boughtState: false;
        // }
        // localStorage.setItem(localStorage.length, JSON.stringify(object));
        updateStorage();
        updateHtml();
    }
});

function addListButtonsListeners() {
    let list = document.getElementById("product-list");
    for(let i = 0; i < localStorage.length; i++) {

        let deleteButton = document.getElementById("delete-"+i);
        if(deleteButton !== null) addDeleteButtonListener(deleteButton, list, i);

        let buyButton = document.getElementById("buy-"+i);
        if(buyButton !== null) addBuyButtonListener(buyButton, i);

        let name = document.getElementById("name-"+i);
        if(name !== null) addNameListener(name, i);

        let minus = document.getElementById("minus-"+i);
        if(minus !== null) addAmountListeners(i);

        let removeFromBoughtButton = document.getElementById("removeFromBought-"+i);
        if(removeFromBoughtButton != null) addRemoveFromBoughtButtonListener(removeFromBoughtButton, i);

    }
    if(localStorage.length === 0) {
        list.style.height = 75+"px";
    }
}

function addDeleteButtonListener(button, list, i) {
    button.addEventListener("click", function () {
        button.parentElement.parentElement.parentElement.remove();
        list.style.height = (list.offsetHeight - 85) + "px";
        localStorage.removeItem(localStorage.key(i));
        updateHtml();
        updateStorage();
        updateSummary();
    });
}

function addBuyButtonListener(button, i) {
    button.addEventListener("click", function () {
        changeItemStateToBought(i);
        updateSummary();
    });
}

function addAmountListeners(i) {
    document.getElementById("minus-"+i).addEventListener("click", function () {
        if(document.getElementById("amount-"+i).textContent != 1) {
            let num = parseInt(document.getElementById("amount-"+i).textContent);
            num--;
            document.getElementById("amount-"+i).textContent = ""+num;
            if(num == 1) document.getElementById("minus-"+i).style.backgroundColor = "#e5a1a1";
            updateStorage()
        }
    })
    document.getElementById("plus-"+i).addEventListener("click", function () {
        let num = parseInt(document.getElementById("amount-"+i).textContent);
        num++;
        document.getElementById("minus-"+i).style.backgroundColor = "red";
        document.getElementById("amount-"+i).textContent = ""+num;
        updateStorage()
    })
}

function addNameListener(name, i) {
    let nameHTML = name.outerHTML;

    name.addEventListener("click", function() {
        if(name.style.textDecoration === "line-through") return;
        name.outerHTML = " <label class=\"name\">\n" +
            "            <input id=\"nameInput-"+i+"\" type=\"text\" placeholder=\"Введіть нову назву\" class=\"input-item\">\n" +
            "        </label>"
        let nameInput = document.getElementById("nameInput-"+i);
        nameInput.select();
        nameInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter" && nameInput.value !== "") {
                if(checkForSimilarNames(document.getElementById("nameInput-"+i).value)) return;
                nameInput.parentElement.outerHTML = nameHTML;
                name = document.getElementById("name-"+i);
                name.textContent = nameInput.value;
                addNameListener(name, i);
                updateStorage()
            }
        })
        nameInput.addEventListener("focusout", function () {
            if(checkForSimilarNames(document.getElementById("nameInput-"+i).value)) return;
            nameInput.parentElement.outerHTML = nameHTML;
            name = document.getElementById("name-"+i);
            name.textContent = nameInput.value;
            addNameListener(name, i);
           updateStorage()
        })
    })
}
function changeItemStateToBought(i) {

    let amount = document.getElementById("amount-"+i);
    document.getElementById("amount-container-"+i).innerHTML = amount.outerHTML;

    let name = document.getElementById("name-"+i);
    name.style.textDecoration = "line-through";

    let buttonContainer = document.getElementById("button-container-"+i);
    buttonContainer.innerHTML = " <button id=\"removeFromBought-"+i+"\" class=\"button fade\" data-tooltip=\"Не куплено\">Не куплено</button>"

    let newButton = document.getElementById("removeFromBought-"+i);
    addRemoveFromBoughtButtonListener(newButton, i);

    updateStorage();
}

function addRemoveFromBoughtButtonListener(button, i) {
    button.addEventListener("click", function() {
        document.getElementById("button-container-"+i).innerHTML = "<button id=\"buy-"+i+"\""+" class=\"button fade\" data-tooltip=\"Куплено\">Куплено</button>\n" +
            "            <button id=\"delete-"+i+"\""+" class=\"delete fade\" data-tooltip=\"Видалити продукт\">X</button>";
        document.getElementById("amount-container-"+i).innerHTML = "<button id=\"minus-"+i+"\""+" class=\"minus-circle\" style=\"background-color: #e5a1a1\">-</button>\n" +
            "            <span id=\"amount-"+i+"\""+" class=\"amount\">"+document.getElementById("amount-"+i).textContent+"</span>\n" +
            "            <button id=\"plus-"+i+"\""+" class=\"plus-circle\">+</button>"
        setMinusColor(i);
        let name = document.getElementById("name-"+i);
        name.style.textDecoration = "none";
        addBuyButtonListener(document.getElementById("buy-"+i), i)
        addDeleteButtonListener(document.getElementById("delete-"+i), document.getElementById("product-list"), i)
        addNameListener(document.getElementById("name-"+i), i);
        addAmountListeners(i);
        updateStorage();
        updateSummary();
    })
}

function setMinusColor(i) {
    let amount = document.getElementById("amount-"+i).textContent;
    if(amount == 1) document.getElementById("minus-"+i).style.backgroundColor = "#e5a1a1";
    else document.getElementById("minus-"+i).style.backgroundColor = "red";
}

function updateStorage() {
    localStorage.clear();
    let container = document.getElementById("items-container");
    for(let i = 0; i < container.children.length; i++) {

        let element = container.children.item(i).children.item(1);

        let objName = element.children.item(0).textContent;
        let objAmount = element.children.item(1).children.length === 1
            ? element.children.item(1).children.item(0).textContent
            : element.children.item(1).children.item(1).textContent;
        let objBoughtState = element.children.item(2).children.length === 1;
        let object = {
            name: objName,
            amount: objAmount,
            boughtState: objBoughtState
        }

        localStorage.setItem(i, JSON.stringify(object));

    }
    updateSummary();
}

function updateHtml() {
    let container = document.getElementById("items-container");
    container.innerHTML = "";

    let notBoughtItem = document.createElement("span");
    notBoughtItem.innerHTML = "<hr class=\"separator\">" +
        "<section id=\"table-element-\" class=\"table-element\">\n" +
        "        <span id=\"name-\" class=\"name\"></span>\n" +
        "\n" +
        "        <span id=\"amount-container-\" class=\"amount-container\">\n" +
        "            <button id=\"minus-\" class=\"minus-circle\" style=\"background-color: #e5a1a1\">-</button>\n" +
        "            <span id=\"amount-\" class=\"amount\"></span>\n" +
        "            <button id=\"plus-\" class=\"plus-circle\">+</button>\n" +
        "        </span>\n" +
        "\n" +
        "        <span id=\"button-container-\" class=\"button-container\">\n" +
        "            <button id=\"buy-\" class=\"button fade\" data-tooltip=\"Куплено\">Куплено</button>\n" +
        "            <button id=\"delete-\" class=\"delete fade\" data-tooltip=\"Видалити продукт\">X</button>\n" +
        "        </span>\n" +
        "    </section>";

    let boughtItem = document.createElement("span");
    boughtItem.innerHTML = "<hr class=\"separator\">" +
        "<section id=\"table-element-\" class=\"table-element\">\n" +
        "        <span id=\"name-\" class=\"name\" style='text-decoration: line-through'></span>\n" +
        "\n" +
        "        <span id=\"amount-container-\" class=\"amount-container\">\n" +
        "            <span id=\"amount-\" class=\"amount\"></span>\n" +
        "        </span>\n" +
        "\n" +
        "        <span id=\"button-container-\" class=\"button-container\">\n" +
        "            <button id=\"removeFromBought-\" class=\"button fade\" data-tooltip=\"Не куплено\">Не куплено</button>\n" +
        "        </span>\n" +
        "    </section>";

    for(let i = 0; i < localStorage.length; i++) {
        let obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
        if(obj.boughtState) {
            let item = document.createElement("span");

            item.innerHTML = boughtItem.innerHTML;

            item.children.item(1).id += localStorage.length-1-i;

            item.children.item(1).children.item(0).id += localStorage.length-1-i;
            item.children.item(1).children.item(0).textContent = obj.name;

            item.children.item(1).children.item(1).id += localStorage.length-1-i;
            item.children.item(1).children.item(1).children.item(0).id += localStorage.length-1-i;
            item.children.item(1).children.item(1).children.item(0).textContent = obj.amount;

            item.children.item(1).children.item(2).id += localStorage.length-1-i;
            item.children.item(1).children.item(2).children.item(0).id += localStorage.length-1-i;

            container.innerHTML = item.outerHTML + container.innerHTML;
        }else{
            console.log("not bought state");
            let item = document.createElement("span");

            item.innerHTML = notBoughtItem.innerHTML;

            item.children.item(1).id += localStorage.length-1-i;

            item.children.item(1).children.item(0).id += localStorage.length-1-i;
            item.children.item(1).children.item(0).textContent = obj.name;

            item.children.item(1).children.item(1).id += localStorage.length-1-i;

            item.children.item(1).children.item(1).children.item(0).id += localStorage.length-1-i;

            if(obj.amount != 1)  item.children.item(1).children.item(1).children.item(0).style.backgroundColor = "red";
            item.children.item(1).children.item(1).children.item(1).id += localStorage.length-1-i;
            item.children.item(1).children.item(1).children.item(1).textContent = obj.amount;

            item.children.item(1).children.item(1).children.item(2).id += localStorage.length-1-i;

            item.children.item(1).children.item(2).id += localStorage.length-1-i;
            item.children.item(1).children.item(2).children.item(0).id += localStorage.length-1-i;
            item.children.item(1).children.item(2).children.item(1).id += localStorage.length-1-i;

            container.innerHTML = item.outerHTML + container.innerHTML;
        }
    }
    addListButtonsListeners();
}

function updateSummary() {
    if(document.getElementById("bought") === null) return;
    document.getElementById("bought").innerHTML = "";
    document.getElementById("not-bought").innerHTML = "";
    document.getElementById("summary").style.height = "250px";
    document.getElementById("bought").style.height = "50px";
    document.getElementById("not-bought").style.height = "50px";

    let boughtCounter = 0;
    let notBoughtCounter = 0;
    for(let i = 0; i < localStorage.length; i++) {
        let name = document.getElementById("name-"+i);
        let amount =  document.getElementById("amount-"+i);
        if(name.style.textDecoration === "line-through") {
            if(boughtCounter > 2) {
                document.getElementById("summary").style.height = (document.getElementById("summary").offsetHeight + 60) + "px";
                document.getElementById("bought").style.height = (document.getElementById("bought").offsetHeight + 60) + "px";
                document.getElementById("bought").innerHTML += "<div class=\"break\"></div>"
                boughtCounter = 0;
            }
            document.getElementById("bought").innerHTML += "<span class=\"summary-item\">\n" +
                "            <span style=\"text-decoration: line-through\">"+name.textContent+"</span>\n" +
                "            <span class=\"summary-circle\">"+amount.textContent+"</span>\n" +
                "        </span>"
            boughtCounter++;
        }else{
            if(notBoughtCounter > 2) {
                document.getElementById("summary").style.height = (document.getElementById("summary").offsetHeight + 60) + "px";
                document.getElementById("not-bought").style.height = (document.getElementById("not-bought").offsetHeight + 60) + "px";
                document.getElementById("not-bought").innerHTML += "<div class=\"break\"></div>"
                notBoughtCounter = 0;
            }
            document.getElementById("not-bought").innerHTML += "<span class=\"summary-item\">\n" +
                "            "+name.textContent+"\n" +
                "            <span class=\"summary-circle\">"+amount.textContent+"</span>\n" +
                "        </span>"
            notBoughtCounter++;
        }

    }
}

function checkForSimilarNames(name) {
    for(let i = 0; i < localStorage.length; i++) {
        let obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
        if(obj.name.toLowerCase() === name.toLowerCase()) {
            return true;
        }
    }
    return false;
}

function addSavedElements() {

    let list = document.getElementById("product-list");
    if (list === null) return;
    let container = document.getElementById("items-container");

    if (localStorage.length === 0) {
        container.innerHTML = "<span>" +
            "<hr class=\"separator\">" +
            "<section id=\"table-element-0\" class=\"table-element\">\n" +
            "        <span id=\"name-0\" class=\"name\">Помідори</span>\n" +
            "\n" +
            "        <span id=\"amount-container-0\" class=\"amount-container\">\n" +
            "            <button id=\"minus-0\" class=\"minus-circle\" style=\"background-color: #e5a1a1\">-</button>\n" +
            "            <span id=\"amount-0\" class=\"amount\">1</span>\n" +
            "            <button id=\"plus-0\" class=\"plus-circle\">+</button>\n" +
            "        </span>\n" +
            "\n" +
            "        <span id=\"button-container-0\" class=\"button-container\">\n" +
            "            <button id=\"buy-0\" class=\"button fade\" data-tooltip=\"Куплено\">Куплено</button>\n" +
            "            <button id=\"delete-0\" class=\"delete fade\" data-tooltip=\"Видалити продукт\">X</button>\n" +
            "        </span>\n" +
            "    </section>" +
            "</span>";

        container.innerHTML += "<span>" +
            "<hr class=\"separator\">" +
            "<section id=\"table-element-1\" class=\"table-element\">\n" +
            "        <span id=\"name-1\" class=\"name\">Печиво</span>\n" +
            "\n" +
            "        <span id=\"amount-container-1\" class=\"amount-container\">\n" +
            "            <button id=\"minus-1\" class=\"minus-circle\" style=\"background-color: #e5a1a1\">-</button>\n" +
            "            <span id=\"amount-1\" class=\"amount\">1</span>\n" +
            "            <button id=\"plus-1\" class=\"plus-circle\">+</button>\n" +
            "        </span>\n" +
            "\n" +
            "        <span id=\"button-container-1\" class=\"button-container\">\n" +
            "           <button id=\"buy-1\" class=\"button fade\" data-tooltip=\"Куплено\">Куплено</button>\n" +
            "            <button id=\"delete-1\" class=\"delete fade\" data-tooltip=\"Видалити продукт\">X</button>\n" +
            "        </span>\n" +
            "    </section>" +
            "</span>";

        container.innerHTML += "<span>" +
            "<hr class=\"separator\">" +
            "<section id=\"table-element-2\" class=\"table-element\">\n" +
            "        <span id=\"name-2\" class=\"name\">Сир</span>\n" +
            "\n" +
            "        <span id=\"amount-container-2\" class=\"amount-container\">\n" +
            "            <button id=\"minus-2\" class=\"minus-circle\" style=\"background-color: #e5a1a1\">-</button>\n" +
            "            <span id=\"amount-2\" class=\"amount\">1</span>\n" +
            "            <button id=\"plus-2\" class=\"plus-circle\">+</button>\n" +
            "        </span>\n" +
            "\n" +
            "        <span id=\"button-container-2\" class=\"button-container\">\n" +
            "            <button id=\"buy-2\" class=\"button fade\" data-tooltip=\"Куплено\">Куплено</button>\n" +
            "            <button id=\"delete-2\" class=\"delete fade\" data-tooltip=\"Видалити продукт\">X</button>\n" +
            "        </span>\n" +
            "    </section>" +
            "</span>";
        updateStorage()
        updateHtml();
    }

    for (let i = 0; i < localStorage.length; i++) {
        list.style.height = (list.offsetHeight + 45) + "px";
    }
}

