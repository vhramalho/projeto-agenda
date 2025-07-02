// Carrega o menu.html dinamicamente no <header>
fetch("menu.html")
    .then(res => res.text())
    .then(data => {
        const header = document.querySelector("header");
        header.innerHTML = data;

        // Após inserir o HTML, ativar o comportamento do menu
        const botaoMenu = document.getElementById("botao-menu");
        const menuLateral = document.getElementById("menu-lateral");
        const fundoEscuro = document.getElementById("fundo-escuro");

        botaoMenu.addEventListener("click", () => {
            menuLateral.classList.add("ativo");
            fundoEscuro.style.display = "block";
        });

        fundoEscuro.addEventListener("click", () => {
            menuLateral.classList.remove("ativo");
            fundoEscuro.style.display = "none";
        });

        // 👉 Define o título com base no nome da página
        const tituloElemento = document.getElementById("titulo-pagina");
        const caminho = window.location.pathname;

        if (caminho.includes("index")) {
            tituloElemento.textContent = "Agenda Victor";
        } else if (caminho.includes("servicos")) {
            tituloElemento.textContent = "Serviços";
        } else if (caminho.includes("pagamento")) {
            tituloElemento.textContent = "Forma de Pagamento";
        } else if (caminho.includes("config")) {
            tituloElemento.textContent = "Configurações";
        } else {
            tituloElemento.textContent = "Agenda";
        }
    });