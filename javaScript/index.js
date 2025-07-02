const listaHorarios = document.getElementById("lista-horarios");
const dataAgenda = document.getElementById("data-agenda");
const btnAnterior = document.getElementById("btnAnterior");
const btnProximo = document.getElementById("btnProximo");

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
    for (let h = 7; h <= 23; h++) {
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

// Referências dos elementos
const btnCalendario = document.getElementById("btnCalendario");
const modalCalendario = document.getElementById("modal-calendario");
const calendarioCorpo = document.getElementById("calendarioCorpo");
const mesAtualSpan = document.getElementById("mesAtual");
const btnMesAnterior = document.getElementById("mesAnterior");
const btnMesSeguinte = document.getElementById("mesSeguinte");

let calendarioData = new Date(dataAtual); // cópia da data atual

// Abrir modal
btnCalendario.addEventListener("click", () => {
    modalCalendario.style.display = "flex";
    gerarCalendario();
});

// Fechar modal ao clicar fora
modalCalendario.addEventListener("click", (e) => {
    if (e.target === modalCalendario) {
        modalCalendario.style.display = "none";
    }
});

// Botões de mês
btnMesAnterior.addEventListener("click", () => {
    calendarioData.setMonth(calendarioData.getMonth() - 1);
    gerarCalendario();
});

btnMesSeguinte.addEventListener("click", () => {
    calendarioData.setMonth(calendarioData.getMonth() + 1);
    gerarCalendario();
});

// Gera o calendário visual
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

    // Preenche os dias anteriores (em branco)
    for (let i = 0; i < primeiroDia; i++) {
        const vazio = document.createElement("div");
        calendarioCorpo.appendChild(vazio);
    }

    // Preenche os dias do mês
    for (let dia = 1; dia <= ultimoDia; dia++) {
        const diaElemento = document.createElement("div");
        diaElemento.textContent = dia;
        diaElemento.addEventListener("click", () => {
            dataAtual.setFullYear(ano, mes, dia);
            renderizarHorarios();
            modalCalendario.style.display = "none";
        });
        calendarioCorpo.appendChild(diaElemento);
    }
}

// Menu lateral
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



