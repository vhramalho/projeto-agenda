window.onload = () => {
    const listaHorarios = document.getElementById("lista-horarios");
    const dataAgenda = document.getElementById("data-agenda");
    const btnAnterior = document.getElementById("btnAnterior");
    const btnProximo = document.getElementById("btnProximo");

    // 🔧 ADICIONADO – Referências ao modal de opções
    const modalOpcoes = document.getElementById("modal-opcoes");
    const textoHorario = document.getElementById("texto-horario");

    // 🔧 Modal de bloqueio/desbloqueio
    const modalBloqueio = document.getElementById("modal-bloqueio");
    const tituloBloqueio = document.getElementById("titulo-bloqueio");

    const btnConfirmarBloqueio = document.getElementById("btnConfirmarBloqueio");
    const btnCancelarBloqueio = document.getElementById("btnCancelarBloqueio");

    let horarioSelecionado = null;

    let dataAtual = new Date();

    // 🧠 Funções auxiliares
    function formatarDataTitulo(data) {
        const meses = [
            "janeiro", "fevereiro", "março", "abril", "maio", "junho",
            "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
        ];
        const dia = data.getDate();
        const mes = meses[data.getMonth()];
        return `${dia} de ${mes}`;
    }

    function getChaveData(data) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");
        return `${ano}-${mes}-${dia}`;
    }

    function gerarHorariosBase() {
        const horarios = [];
        for (let h = 8; h <= 20; h++) {
            horarios.push({ hora: `${h.toString().padStart(2, '0')}:00`, status: "livre" });
            if (h !== 23) {
                horarios.push({ hora: `${h.toString().padStart(2, '0')}:30`, status: "livre" });
            }
        }
        return horarios;
    }

    // 🔁 Carrega ou cria os horários do dia
    function carregarHorarios(chave) {
        const salvo = localStorage.getItem("agenda_" + chave);
        return salvo ? JSON.parse(salvo) : gerarHorariosBase();
    }

    function salvarHorarios(chave, lista) {
        localStorage.setItem("agenda_" + chave, JSON.stringify(lista));
    }

    // 🖥️ Renderiza na tela
    function renderizarHorarios() {
        const chave = getChaveData(dataAtual);
        const horarios = carregarHorarios(chave);
        listaHorarios.innerHTML = "";

        horarios.forEach(item => {
            const li = document.createElement("li");
            li.className = item.status;
            li.innerHTML = `
<span class="hora">${item.hora}</span>
<span class="descricao">${item.status === "bloqueado"
                    ? "Bloqueado"
                    : item.status === "agendado" || item.status === "realizado"
                        ? `${item.cliente || ""} - ${item.servico || ""}`
                        : ""
                }</span>
<span class="valor">${item.status === "realizado" && item.valor ? "R$" + item.valor : ""
                }</span>
`;

            // 🔧 ADICIONADO – Clique no horário livre
            li.addEventListener("click", () => {

                if (item.status === "livre") {
                    textoHorario.textContent = `Horário: ${item.hora}`;
                    horarioSelecionado = item.hora;
                    modalOpcoes.classList.add("ativo")

                } else if (item.status === "bloqueado") {

                    tituloBloqueio.textContent = "Desbloquear Horário";

                    horarioSelecionado = item.hora;
                    modalBloqueio.classList.add("ativo");

                }
            });
            modalOpcoes.addEventListener("click", (e) => {
                if (e.target === modalOpcoes) {
                    modalOpcoes.classList.remove("ativo");
                    modalOpcoes.classList.remove("oculto")
                }
            });

            listaHorarios.appendChild(li);
        });

        dataAgenda.textContent = formatarDataTitulo(dataAtual);
    }

    // 📅 Botões para mudar o dia
    btnAnterior.addEventListener("click", () => {
        dataAtual.setDate(dataAtual.getDate() - 1);
        renderizarHorarios();
        verificarSeMostrarBotaoHoje();
    });

    btnProximo.addEventListener("click", () => {
        dataAtual.setDate(dataAtual.getDate() + 1);
        renderizarHorarios();
        verificarSeMostrarBotaoHoje();
    });

    // 🚀 Inicial
    renderizarHorarios();
    const btnVoltarHoje = document.getElementById("btnVoltarHoje");

    function verificarSeMostrarBotaoHoje() {
        const hoje = new Date();
        const mesmaData =
            hoje.getFullYear() === dataAtual.getFullYear() &&
            hoje.getMonth() === dataAtual.getMonth() &&
            hoje.getDate() === dataAtual.getDate();

        btnVoltarHoje.style.display = mesmaData ? "none" : "flex";
    }

    btnVoltarHoje.addEventListener("click", () => {
        dataAtual = new Date();
        renderizarHorarios();
        verificarSeMostrarBotaoHoje();
    });
    verificarSeMostrarBotaoHoje();

    // =================== CALENDÁRIO ===================

    const btnCalendario = document.getElementById("btnCalendario");
    const modalCalendario = document.getElementById("modal-calendario");
    const calendarioCorpo = document.getElementById("calendarioCorpo");
    const mesAtualSpan = document.getElementById("mesAtual");
    const btnMesAnterior = document.getElementById("mesAnterior");
    const btnMesSeguinte = document.getElementById("mesSeguinte");

    let calendarioData = new Date(dataAtual);

    btnCalendario.addEventListener("click", () => {
        modalCalendario.style.display = "flex";
        gerarCalendario();
    });

    modalCalendario.addEventListener("click", (e) => {
        if (e.target === modalCalendario) {
            modalCalendario.style.display = "none";
        }
    });

    btnMesAnterior.addEventListener("click", () => {
        calendarioData.setMonth(calendarioData.getMonth() - 1);
        gerarCalendario();
    });

    btnMesSeguinte.addEventListener("click", () => {
        calendarioData.setMonth(calendarioData.getMonth() + 1);
        gerarCalendario();
    });

    function gerarCalendario() {
        calendarioCorpo.innerHTML = "";

        const ano = calendarioData.getFullYear();
        const mes = calendarioData.getMonth();
        const primeiroDia = new Date(ano, mes, 1).getDay();
        const ultimoDia = new Date(ano, mes + 1, 0).getDate();

        const nomeMeses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        mesAtualSpan.textContent = `${nomeMeses[mes]} ${ano}`;

        for (let i = 0; i < primeiroDia; i++) {
            const vazio = document.createElement("div");
            calendarioCorpo.appendChild(vazio);
        }

        for (let dia = 1; dia <= ultimoDia; dia++) {
            const diaElemento = document.createElement("div");
            diaElemento.textContent = dia;
            diaElemento.addEventListener("click", () => {
                dataAtual.setFullYear(ano, mes, dia);
                renderizarHorarios();
                modalCalendario.style.display = "none";
                verificarSeMostrarBotaoHoje();
            });
            calendarioCorpo.appendChild(diaElemento);
        }
    }

    // Menu lateral
    const botaoMenu = document.getElementById("botao-menu");
    const menuLateral = document.getElementById("menu-lateral");
    const fundoEscuro = document.getElementById("fundo-escuro");

    // Ao clicar em "Bloquear" no modal-opcoes
    document.getElementById("btnBloquear").addEventListener("click", () => {
        modalOpcoes.classList.remove("ativo");
        tituloBloqueio.textContent = "Bloquear horário";
        modalBloqueio.classList.add("ativo");
    });

    btnCancelarBloqueio.addEventListener("click", () => {
        modalBloqueio.classList.remove("ativo");
    });

    modalBloqueio.addEventListener("click", (e) => {
        if (e.target === modalBloqueio) {
            modalBloqueio.classList.remove("ativo");
        }
    });

    btnConfirmarBloqueio.addEventListener("click", () => {
        const chave = getChaveData(dataAtual);
        const horarios = carregarHorarios(chave);

        // Atualiza o horário atual
        horarios.forEach(item => {
            if (item.hora === horarioSelecionado) {
                item.status = tituloBloqueio.textContent.includes("Desbloquear") ? "livre" : "bloqueado";
            }
        });

        salvarHorarios(chave, horarios);

        modalBloqueio.classList.remove("ativo");
        renderizarHorarios();
    });
    const modalAgendar = document.getElementById("modal-agendar");
    const tituloAgendar = document.getElementById("titulo-agendar");
    const inputNomeCliente = document.getElementById("input-nome-cliente");
    const listaServicos = document.getElementById("lista-servicos");
    const btnCancelarAgendar = document.getElementById("btnCancelarAgendar");
    const btnConfirmarAgendar = document.getElementById("btnConfirmarAgendar");

    // Ao clicar em "Agendar" no modal-opcoes
    document.getElementById("btnAgendar").addEventListener("click", () => {
        console.log("Clique em agendar");
        modalOpcoes.classList.remove("ativo");
        tituloAgendar.textContent = `Horário: ${horarioSelecionado}`;
        inputNomeCliente.value = "";
        listaServicos.innerHTML = "";

        const servicos = JSON.parse(localStorage.getItem("servicos")) || [];

        servicos.forEach(serv => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = serv.nome;
            checkbox.id = `serv-${serv.nome}`;

            const label = document.createElement("label");
            label.htmlFor = checkbox.id;
            label.textContent = serv.nome;

            label.prepend(checkbox);
            listaServicos.appendChild(label);
        });

        modalAgendar.classList.add("ativo");
    });

    // Cancelar
    btnCancelarAgendar.addEventListener("click", () => {
        modalAgendar.classList.remove("ativo");
    });

    // Fechar ao clicar fora
    modalAgendar.addEventListener("click", (e) => {
        if (e.target === modalAgendar) {
            modalAgendar.classList.remove("ativo");
        }
    });

    // Confirmar
    btnConfirmarAgendar.addEventListener("click", () => {
        const nome = inputNomeCliente.value.trim();
        if (!nome) {
            alert("Por favor, preencha o nome do cliente.");
            return;
        }

        const servicosSelecionados = [...listaServicos.querySelectorAll("input:checked")]
            .map(input => input.value);

        const chave = getChaveData(dataAtual);
        const horarios = carregarHorarios(chave);

        horarios.forEach(item => {
            if (item.hora === horarioSelecionado) {
                item.status = "agendado";
                item.cliente = nome;
                item.servico = servicosSelecionados.join(" + ");
            }
        });

        salvarHorarios(chave, horarios);
        modalAgendar.classList.remove("ativo");
        renderizarHorarios();
    });





}


