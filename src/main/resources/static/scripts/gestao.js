const API_URL = '/api/gestao/mensalistas';

document.addEventListener('DOMContentLoaded', carregarMensalistas);

function mostrarToast(msg, tipo = 'success') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `toast show ${tipo}`;
    setTimeout(() => t.className = 'toast', 3500);
}

function calcularDataFim() {
    const dataInicioVal = document.getElementById('dataInicio').value;
    const plano = document.getElementById('tipoPlanoGestao').value;
    const campoFim = document.getElementById('dataFim');

    if (!dataInicioVal || !plano) return;

    let data = new Date(dataInicioVal);
    data.setMinutes(data.getMinutes() + data.getTimezoneOffset());

    if (plano === 'MENSAL') data.setMonth(data.getMonth() + 1);
    else if (plano === 'TRIMESTRAL') data.setMonth(data.getMonth() + 3);
    else if (plano === 'SEMESTRAL') data.setMonth(data.getMonth() + 6);

    campoFim.value = data.toISOString().split('T')[0];
}

function maskCPF(i) {
    let v = i.value.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    i.value = v;
}

function maskPlaca(i) {
    let v = i.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (v.length > 3) v = v.substring(0, 3) + "-" + v.substring(3, 7);
    i.value = v;
}

async function carregarMensalistas() {
    const res = await fetch(API_URL);
    const dados = await res.json();
    const tbody = document.getElementById('tabela-mensalistas');

    tbody.innerHTML = dados.map(m => `
        <tr>
            <td>${m.cpf}</td>
            <td>${m.nome}</td>
            <td><span class="tag-placa">${m.placa}</span></td>
            <td>${m.tipoPlano}</td>
            <td>${m.vencimento ? new Date(m.vencimento).toLocaleDateString('pt-BR') : '-'}</td>
            <td>
                <button onclick="prepararEdicao('${m.cpf}')" class="btn-edit" style="background:#f1c40f;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">Editar</button>
                <button onclick="excluirMensalista('${m.cpf}')" class="btn-delete" style="background:#c0392b;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">Excluir</button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="6">Nenhum mensalista com veículo ativo encontrado.</td></tr>';
}

async function salvarAssinatura() {
    const cpfEditando = document.getElementById('modoEdicaoCpf').value;
    const payload = {
        nome: document.getElementById('nomeMensalista').value,
        cpf: document.getElementById('cpfCnpj').value,
        telefone: document.getElementById('telefoneMensalista').value,
        email: document.getElementById('emailMensalista').value,
        endereco: document.getElementById('enderecoMensalista').value,
        placa: document.getElementById('placaPrincipal').value,
        tipoPlano: document.getElementById('tipoPlanoGestao').value,
        dataInicio: document.getElementById('dataInicio').value
    };

    const url = cpfEditando ? `${API_URL}/${cpfEditando}` : '/api/gestao/assinatura';
    const metodo = cpfEditando ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method: metodo,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        mostrarToast('Dados sincronizados com sucesso!');
        cancelarEdicao();
        carregarMensalistas();
    } else {
        mostrarToast('Erro ao processar dados.', 'error');
    }
}

async function prepararEdicao(cpf) {
    const res = await fetch(`${API_URL}/${cpf}`);
    const m = await res.json();

    document.getElementById('modoEdicaoCpf').value = m.cpf;
    document.getElementById('cpfCnpj').value = m.cpf;
    document.getElementById('cpfCnpj').readOnly = true;
    document.getElementById('nomeMensalista').value = m.nome;
    document.getElementById('telefoneMensalista').value = m.telefone;
    document.getElementById('emailMensalista').value = m.email;
    document.getElementById('enderecoMensalista').value = m.endereco || '';
    document.getElementById('tipoPlanoGestao').value = m.tipoPlano;
    document.getElementById('placaPrincipal').value = m.placa;

    document.getElementById('btnCancelar').style.display = 'block';
    document.getElementById('btnSalvar').textContent = 'Atualizar Assinatura';
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function cancelarEdicao() {
    document.getElementById('formGestao').reset();
    document.getElementById('cpfCnpj').readOnly = false;
    document.getElementById('modoEdicaoCpf').value = '';
    document.getElementById('btnCancelar').style.display = 'none';
    document.getElementById('btnSalvar').textContent = 'Salvar Assinatura';
    document.getElementById('dataFim').value = '';
}

async function excluirMensalista(cpf) {
    if (!confirm('Deseja remover o plano deste mensalista?')) return;
    const res = await fetch(`${API_URL}/${cpf}`, { method: 'DELETE' });
    if (res.ok) {
        mostrarToast('Plano removido!');
        carregarMensalistas();
    }
}
