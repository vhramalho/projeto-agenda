let dataAtual = obterDataDoSistema();


document.addEventListener("DOMContentLoaded", () => {
    
    const agendamentos = carregarTodosAgendamentosRealizados();
    const servicosCadastrados = JSON.parse(localStorage.getItem("servicos")) || [];
    const formasCadastradas = JSON.parse(localStorage.getItem("formasPagamento")) || [];

    preencherRelatorio("dia", filtrarPorDia(agendamentos, dataAtual), formatarData(dataAtual), servicosCadastrados, formasCadastradas);
    preencherRelatorio("semana", filtrarPorSemana(agendamentos, dataAtual), "Semana " + getNumeroSemana(dataAtual), servicosCadastrados, formasCadastradas);
    preencherRelatorio("mes", filtrarPorMes(agendamentos, dataAtual), formatarMes(dataAtual), servicosCadastrados, formasCadastradas);
    preencherRelatorio("ano", filtrarPorAno(agendamentos, dataAtual), "Ano " + dataAtual.slice(0, 4), servicosCadastrados, formasCadastradas);
});

// 1. Data do sistema em formato YYYY-MM-DD
function obterDataDoSistema() {
    const dataLocal = localStorage.getItem("dataAtual");

    if (dataLocal && dataLocal.includes("/")) {
        const [dia, mes, ano] = dataLocal.split("/");
        return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
    }

    // Fallback: data local (não UTC)
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

// 2. Coleta apenas os agendamentos "realizado"
function carregarTodosAgendamentosRealizados() {
    const agendamentos = [];

    for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        if (!chave.startsWith("agenda_")) continue;

        const data = chave.replace("agenda_", ""); // YYYY-MM-DD
        const lista = JSON.parse(localStorage.getItem(chave)) || [];

        lista.forEach(item => {
            if (item.status === "realizado") {
                agendamentos.push({ ...item, data });
            }
        });
    }

    return agendamentos;
}

// 3. Filtros por período
function filtrarPorDia(ags, data) {
    return ags.filter(a => a.data === data);
}

function filtrarPorSemana(ags, data) {
    const semana = getNumeroSemana(data);
    const ano = data.slice(0, 4);
    return ags.filter(a => getNumeroSemana(a.data) === semana && a.data.startsWith(ano));
}

function filtrarPorMes(ags, data) {
    const [ano, mes] = data.split("-");
    return ags.filter(a => a.data.startsWith(`${ano}-${mes}`));
}

function filtrarPorAno(ags, data) {
    const ano = data.slice(0, 4);
    return ags.filter(a => a.data.startsWith(ano));
}

// 4. Preenche a caixa de relatório
function preencherRelatorio(tipo, ags, titulo, servicosCadastrados, formasCadastradas) {
    const bloco = document.getElementById(`relatorio-${tipo}`);
    if (!bloco) return;

    bloco.querySelector("h3").textContent = tipo === "semana" ? titulo : `${capitalize(tipo)} ${titulo}`;
    bloco.querySelector(".valor-total").textContent = "R$ " + somarValores(ags).toFixed(2);
    bloco.querySelector(".atendimentos-total").textContent = ags.length;

    bloco.querySelector(".formas-pagamento").innerHTML = gerarResumoPagamentos(ags, formasCadastradas);
    bloco.querySelector(".servicos-realizados").innerHTML = gerarResumoServicos(ags, servicosCadastrados);
}

// 5. Soma de valores
function somarValores(lista) {
    return lista.reduce((soma, a) => soma + (a.valor || 0), 0);
}

// 6. Formas de pagamento agrupadas e somadas
function gerarResumoPagamentos(lista, formasCadastradas) {
    const resumo = {}; // { nomeDaForma: valorTotal }
    const taxas = {}; // { nomeDaForma: taxa % }

    lista.forEach(a => {
        const formas = Array.isArray(a.formaPagamento) ? a.formaPagamento : [];

        formas.forEach(fp => {
            const nome = fp.forma || "Indefinido";
            const valor = fp.valor || 0;

            if (!resumo[nome]) resumo[nome] = 0;
            resumo[nome] += valor;

            // salva taxa se existir na forma cadastrada
            const formaEncontrada = formasCadastradas.find(f => f.nome === nome);
            if (formaEncontrada && formaEncontrada.taxa) {
                taxas[nome] = formaEncontrada.taxa;
            }
        });
    });

    return Object.entries(resumo).map(([nome, valor]) => {
        let taxaTexto = "";

        if (taxas[nome]) {
            const valorTaxa = (valor * (taxas[nome] / 100)).toFixed(2);
            taxaTexto = ` (R$ ${valorTaxa})`;
        }

        return `${nome}: R$ ${valor.toFixed(2)}${taxaTexto}`;
    }).join("<br>");
}

// 7. Serviços agrupados (dividindo + se necessário)
function gerarResumoServicos(lista, servicosCadastrados) {
    const contagem = {};

    lista.forEach(a => {
        let servicos = [];

        if (Array.isArray(a.servico)) {
            servicos = a.servico;
        } else if (typeof a.servico === "string") {
            servicos = a.servico.split("+").map(s => s.trim());
        }

        servicos.forEach(nome => {
            if (!contagem[nome]) contagem[nome] = 0;
            contagem[nome]++;
        });
    });

    return servicosCadastrados.map(s => {
        const nome = s.nome;
        const qtd = contagem[nome] || 0;
        return `${nome}: ${qtd}`;
    }).join("<br>");
}

// 8. Formatadores
function formatarData(data) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}`;
}

function formatarMes(data) {
    const [ano, mes] = data.split("-");
    return `${mes}/${ano}`;
}

function getNumeroSemana(dataStr) {
    const [ano, mes, dia] = dataStr.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia);
    const primeiroDiaAno = new Date(data.getFullYear(), 0, 1);
    const diff = (data - primeiroDiaAno + ((primeiroDiaAno.getDay() + 6) % 7) * 86400000) / 86400000;
    return Math.ceil(diff / 7);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


