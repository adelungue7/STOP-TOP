let clientesCache = [];

document.addEventListener('DOMContentLoaded', () => {
    carregarMensalistas();
    configurarBuscaNome();
    configurarCalculoDataFim();
    configurarFormulario();
});

function carregarMensalistas() {
    fetch('/api/gestao/mensalistas')
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('tabela-mensalistas');
            tbody.innerHTML = '';
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhuma assinatura ativa encontrada.</td></tr>';
                return;
            }
            data.forEach(m => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${m.nome}</td>
                    <td><span class="tag-placa">${m.placa}</span></td>
                    <td>${m.tipoPlano}</td>
                    <td>${m.dataInicio}</td>
                    <td>${m.vencimento ? new Date(m.vencimento).toLocaleDateString('pt-BR') : 'N/A'}</td>
                    <td>
                        <button onclick="deletarMensalista('${m.cpf}')" class="btn-delete" style="background:#c0392b;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">Excluir</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(err => console.error('Erro ao carregar mensalistas:', err));
}

function configurarBuscaNome() {
    const nomeInput = document.getElementById('nomeMensalista');
    const sugestoes = document.getElementById('listaSugestoes');

    nomeInput.addEventListener('input', () => {
        const query = nomeInput.value.toLowerCase();
        if (query.length < 2) {
            sugestoes.style.display = 'none';
            return;
        }

        fetch('/clientes')
            .then(res => res.json())
            .then(clientes => {
                const filtrados = clientes.filter(c => c.nome.toLowerCase().includes(query));
                if (filtrados.length > 0) {
                    sugestoes.innerHTML = filtrados.map(c => 
                        `<div class="suggestion-item" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;" onclick="selecionarCliente('${c.nome}', '${c.cpf}')">
                            ${c.nome} (${c.cpf})
                        </div>`
                    ).join('');
                    sugestoes.style.display = 'block';
                } else {
                    sugestoes.style.display = 'none';
                }
            });
    });

    document.addEventListener('click', (e) => {
        if (e.target !== nomeInput) sugestoes.style.display = 'none';
    });
}

function selecionarCliente(nome, cpf) {
    document.getElementById('nomeMensalista').value = nome;
    document.getElementById('cpfCnpj').value = cpf;
    document.getElementById('listaSugestoes').style.display = 'none';
}

function configurarCalculoDataFim() {
    const inputs = ['tipoPlanoGestao', 'dataInicio'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('change', calcularDataFim);
    });
}

function calcularDataFim() {
    const tipo = document.getElementById('tipoPlanoGestao').value;
    const inicio = document.getElementById('dataInicio').value;
    if (!inicio) return;

    const data = new Date(inicio + 'T00:00:00');
    if (tipo === 'AVULSO') {
        // Avulso vence no mesmo dia ou não tem vencimento fixo, mas para consistência:
        data.setDate(data.getDate());
    } else if (tipo === 'DIARIO') {
        data.setDate(data.getDate() + 1);
    } else if (tipo === 'MENSAL') {
        data.setMonth(data.getMonth() + 1);
    } else if (tipo === 'TRIMESTRAL') {
        data.setMonth(data.getMonth() + 3);
    } else if (tipo === 'SEMESTRAL') {
        data.setMonth(data.getMonth() + 6);
    }

    document.getElementById('dataFim').value = data.toISOString().split('T')[0];
}

function configurarFormulario() {
    document.getElementById('gestaoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const cpf = document.getElementById('cpfCnpj').value;
        if (!cpf) {
            alert('Selecione um cliente válido da lista.');
            return;
        }

        const payload = {
            nome: document.getElementById('nomeMensalista').value,
            cpf: cpf,
            placa: document.getElementById('placaPrincipal').value,
            tipoPlano: document.getElementById('tipoPlanoGestao').value,
            dataInicio: document.getElementById('dataInicio').value
        };

        fetch('/api/gestao/assinatura', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (res.ok) {
                alert('Assinatura salva com sucesso!');
                location.reload();
            } else {
                alert('Erro ao salvar assinatura.');
            }
        })
        .catch(err => console.error('Erro:', err));
    });
}

function deletarMensalista(cpf) {
    if (confirm('Deseja realmente excluir esta assinatura?')) {
        fetch(`/api/gestao/mensalistas/${cpf}`, { method: 'DELETE' })
            .then(res => {
                if (res.ok) {
                    alert('Assinatura excluída!');
                    carregarMensalistas();
                }
            });
    }
}
