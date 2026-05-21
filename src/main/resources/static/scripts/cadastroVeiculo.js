const API_URL = '/veiculos';
 
function mostrarToast(mensagem, tipo = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = mensagem;
    toast.className = 'toast ' + tipo + ' show';
    setTimeout(() => { toast.className = 'toast'; }, 3500);
}
 
function limparFormulario() {
    document.getElementById('formVeiculo').reset();
    document.getElementById('veiculoId').value = '';
    document.getElementById('btnSalvar').textContent = 'Adicionar Veículo';
    document.getElementById('btnCancelarEdicao').style.display = 'none';
    document.getElementById('editModeBanner').style.display = 'none';
}
 
document.addEventListener('DOMContentLoaded', () => {
    carregarVeiculos();
 
    document.getElementById('formVeiculo').addEventListener('submit', function (e) {
        e.preventDefault();
        salvarVeiculo();
    });
 
    document.getElementById('btnCancelarEdicao').addEventListener('click', limparFormulario);
});
 
// ── GET /veiculos ──────────────────────────────
async function carregarVeiculos() {
    const tbody = document.getElementById('tabelaVeiculosBody');
    tbody.innerHTML = '<tr class="table-status"><td colspan="6">Carregando veículos...</td></tr>';
 
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error('Erro na resposta do servidor');
 
        const veiculos = await resposta.json();
 
        if (veiculos.length === 0) {
            tbody.innerHTML = '<tr class="table-status"><td colspan="6">Nenhum veículo cadastrado ainda.</td></tr>';
            return;
        }
 
        tbody.innerHTML = veiculos.map(v => {
            return `
                <tr>
                    <td><strong>${v.vaga || '-'}</strong></td>
                    <td>${v.nomeVeiculo   || '-'}</td>
                    <td>${v.placa         || '-'}</td>
                    <td>${v.nomeProprietario || '-'}</td>
                    <td>${v.descricao || '-'}</td>
                    <td style="display:flex;gap:0.5rem;justify-content:flex-start;padding-top:1.2rem;">
                        <button onclick="editarVeiculo(${v.id})"
                                style="background:#f1c40f;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">
                            ✏️ Editar
                        </button>
                        <button onclick="excluirVeiculo(${v.id})"
                                style="background:#c0392b;color:#fff;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">
                            🗑️ Excluir
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
 
    } catch (erro) {
        console.error('Erro ao carregar veículos:', erro);
        tbody.innerHTML = '<tr class="table-status"><td colspan="6">Erro ao carregar. Verifique se o backend está rodando.</td></tr>';
    }
}
 
// ── POST / PUT /veiculos ───────────────────────────
async function salvarVeiculo() {
    const id                = document.getElementById('veiculoId').value;
    const nomeVeiculo       = document.getElementById('nomeVeiculo').value.trim();
    const nomeProprietario  = document.getElementById('nomeProprietario').value.trim();
    const placa             = document.getElementById('placaVeiculo').value.trim();
    const descricao         = document.getElementById('descricaoVeiculo').value.trim();
    const vaga              = document.getElementById('vagaVeiculo').value.trim();
 
    if (!nomeVeiculo) { mostrarToast('Informe o nome do veículo.', 'error'); return; }
    if (!nomeProprietario) { mostrarToast('Informe o nome do proprietário.', 'error'); return; }
    if (!placa) { mostrarToast('Informe a placa do veículo.', 'error'); return; }
 
    const corpo = { nomeVeiculo, nomeProprietario, placa, descricao, vaga };
 
    const metodo     = id ? 'PUT' : 'POST';
    const urlDestino = id ? `${API_URL}/${id}` : API_URL;
 
    try {
        const resposta = await fetch(urlDestino, {
            method:  metodo,
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(corpo)
        });
 
        if (!resposta.ok) {
            const mensagemErro = await resposta.text();
            throw new Error(mensagemErro);
        }
 
        mostrarToast(id ? 'Veículo atualizado com sucesso!' : 'Veículo cadastrado com sucesso!');
        limparFormulario();
        carregarVeiculos();
 
    } catch (erro) {
        console.error('Erro ao salvar veículo:', erro);
        const msg = erro.message || '';
 
        if (msg.toLowerCase().includes('proprietário não encontrado') || msg.toLowerCase().includes('proprietario nao encontrado')) {
            mostrarToast('Proprietário não encontrado. Cadastre o cliente primeiro.', 'error');
        } else if (msg.toLowerCase().includes('placa')) {
            mostrarToast('Já existe um veículo cadastrado com esta placa.', 'error');
        } else {
            mostrarToast('Erro ao salvar veículo. Tente novamente.', 'error');
        }
    }
}
 
// ── GET /veiculos/{id} ────────────────────────────
async function editarVeiculo(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`);
        if (!resposta.ok) throw new Error('Veículo não encontrado');
 
        const v = await resposta.json();
 
        document.getElementById('veiculoId').value           = v.id;
        document.getElementById('nomeVeiculo').value         = v.nomeVeiculo        || '';
        document.getElementById('nomeProprietario').value    = v.nomeProprietario   || '';
        document.getElementById('placaVeiculo').value        = v.placa              || '';
        document.getElementById('vagaVeiculo').value         = v.vaga               || '';
        document.getElementById('descricaoVeiculo').value    = v.descricao          || '';
 
        document.getElementById('btnSalvar').textContent = 'Atualizar Veículo';
        document.getElementById('btnCancelarEdicao').style.display = 'block';
        document.getElementById('editModeBanner').style.display = 'block';
 
        window.scrollTo({ top: 0, behavior: 'smooth' });
 
    } catch (erro) {
        console.error('Erro ao buscar veículo:', erro);
        mostrarToast('Erro ao carregar dados do veículo.', 'error');
    }
}
 
// ── DELETE /veiculos/{id} ─────────────────────────────
async function excluirVeiculo(id) {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) return;
 
    try {
        const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!resposta.ok) throw new Error('Erro ao excluir');
 
        mostrarToast('Veículo excluído com sucesso.');
        carregarVeiculos();
 
    } catch (erro) {
        console.error('Erro ao excluir veículo:', erro);
        mostrarToast('Erro ao excluir o veículo.', 'error');
    }
}