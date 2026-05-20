// ─────────────────────────────────────────────────────────────────────────────
// cadastroVeiculo.js  —  Módulo de Veículos (Stop Top)
// Padrão idêntico ao cadastroCliente.js: toast, fetch, CRUD completo.
// ─────────────────────────────────────────────────────────────────────────────

// URL Relativa: Permite que funcione tanto no localhost quanto em produção
const API_URL = '/veiculos';

// ── Utilitários ───────────────────────────────────────────────────────────────

/**
 * Exibe um toast de feedback na tela.
 * @param {string} mensagem - Texto a exibir.
 * @param {'success'|'error'} tipo - Estilo do toast.
 */
function mostrarToast(mensagem, tipo = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = mensagem;
    toast.className = 'toast ' + tipo + ' show';
    setTimeout(() => { toast.className = 'toast'; }, 3500);
}

/**
 * Limpa todos os campos do formulário e retorna ao estado de criação.
 */
function limparFormulario() {
    document.getElementById('formVeiculo').reset();
    document.getElementById('veiculoId').value = '';
    document.getElementById('btnSalvar').textContent = 'Adicionar Veículo';
    document.getElementById('btnCancelarEdicao').style.display = 'none';
    document.getElementById('editModeBanner').classList.remove('visible');
}

// ── Inicialização ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

    // Carrega a tabela assim que a página abre
    carregarVeiculos();

    // FIX 1: Submissão do formulário vinculada ao id correto
    document.getElementById('formVeiculo').addEventListener('submit', function (e) {
        e.preventDefault();
        salvarVeiculo();
    });

    // Botão cancelar edição
    document.getElementById('btnCancelarEdicao').addEventListener('click', limparFormulario);

    // FIX 2: Upload de imagem — converte o arquivo para base64 e preenche o campo
    document.getElementById('imagemArquivo').addEventListener('change', function () {
        const arquivo = this.files[0];
        if (!arquivo) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            // Guarda o base64 no campo de texto para ser enviado como JSON
            document.getElementById('imagemVeiculo').value = e.target.result;
        };
        reader.readAsDataURL(arquivo);
    });
});

// ── GET /veiculos — Carregar e renderizar tabela ──────────────────────────────

// ── GET /veiculos — Carregar e renderizar tabela ──────────────────────────────

async function carregarVeiculos() {
    const tbody = document.getElementById('tabelaVeiculosBody');
    tbody.innerHTML = '<tr class="table-status"><td colspan="7">Carregando veículos...</td></tr>';

    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error('Erro na resposta do servidor');

        const veiculos = await resposta.json();

        if (veiculos.length === 0) {
            tbody.innerHTML = '<tr class="table-status"><td colspan="7">Nenhum veículo cadastrado ainda.</td></tr>';
            return;
        }

        tbody.innerHTML = veiculos.map((v,index) => {

            const numeroDaLinha = index + 1;
            const imgSrc = v.imagemVeiculo ? v.imagemVeiculo : 'https://placehold.co/50x50/cccccc/666666?text=🚗';

            return `
                <tr>
                    <td><strong>${numeroDaLinha}</strong></td>
                    
                    <td>
                        <img src="${imgSrc}" alt="Veículo" style="width:50px;height:50px;border-radius:4px;object-fit:cover;">
                    </td>
                    
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
        tbody.innerHTML = '<tr class="table-status"><td colspan="7">Erro ao carregar. Verifique se o backend está rodando.</td></tr>';
    }
}

// ── POST /veiculos  ou  PUT /veiculos/{id} — Cadastrar ou atualizar ───────────

async function salvarVeiculo() {
    const id                = document.getElementById('veiculoId').value;
    const nomeVeiculo       = document.getElementById('nomeVeiculo').value.trim();
    const nomeProprietario  = document.getElementById('nomeProprietario').value.trim();
    const imagemVeiculo     = document.getElementById('imagemVeiculo').value.trim();
    const placa             = document.getElementById('placaVeiculo').value.trim();
    const descricao         = document.getElementById('descricaoVeiculo').value.trim();

    // FIX 5: Validação de campos obrigatórios no frontend antes de chamar a API
    if (!nomeVeiculo) {
        mostrarToast('Informe o nome do veículo.', 'error');
        return;
    }
    if (!nomeProprietario) {
        mostrarToast('Informe o nome do proprietário.', 'error');
        return;
    }
    if (!placa) {
        mostrarToast('Informe a placa do veículo.', 'error');
        return;
    }

    // FIX 6: Corpo JSON com os nomes exatos dos campos da entity Veiculo.java
    const corpo = { nomeVeiculo, nomeProprietario, imagemVeiculo, placa, descricao };

    const metodo     = id ? 'PUT'        : 'POST';
    const urlDestino = id ? `${API_URL}/${id}` : API_URL;

    try {
        const resposta = await fetch(urlDestino, {
            method:  metodo,
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(corpo)
        });

        if (!resposta.ok) {
            // FIX 7: Lê a mensagem de erro enviada pelo VeiculoController
            // (proprietário não encontrado, placa duplicada, etc.)
            const mensagemErro = await resposta.text();
            throw new Error(mensagemErro);
        }

        mostrarToast(id ? 'Veículo atualizado com sucesso!' : 'Veículo cadastrado com sucesso!');
        limparFormulario();
        carregarVeiculos();

    } catch (erro) {
        console.error('Erro ao salvar veículo:', erro);

        // FIX 8: Mensagens de erro específicas traduzidas para o usuário
        const msg = erro.message || '';

        if (msg.toLowerCase().includes('proprietário não encontrado') ||
            msg.toLowerCase().includes('proprietario nao encontrado')) {
            mostrarToast('Proprietário não encontrado. Cadastre o cliente primeiro.', 'error');

        } else if (msg.toLowerCase().includes('placa')) {
            mostrarToast('Já existe um veículo cadastrado com esta placa.', 'error');

        } else {
            mostrarToast('Erro ao salvar veículo. Tente novamente.', 'error');
        }
    }
}

// ── GET /veiculos/{id} — Preencher formulário para edição ────────────────────

async function editarVeiculo(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`);
        if (!resposta.ok) throw new Error('Veículo não encontrado');

        const v = await resposta.json();

        // FIX 9: Preenche campos usando os IDs corretos do HTML
        document.getElementById('veiculoId').value           = v.id;
        document.getElementById('nomeVeiculo').value         = v.nomeVeiculo        || '';
        document.getElementById('nomeProprietario').value    = v.nomeProprietario   || '';
        document.getElementById('imagemVeiculo').value       = v.imagemVeiculo      || '';
        document.getElementById('placaVeiculo').value        = v.placa              || '';
        document.getElementById('descricaoVeiculo').value    = v.descricao          || '';

        // Altera botões para modo de edição
        document.getElementById('btnSalvar').textContent = 'Atualizar Veículo';
        document.getElementById('btnCancelarEdicao').style.display = 'block';
        document.getElementById('editModeBanner').classList.add('visible');

        // Rola para o topo onde está o formulário
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (erro) {
        console.error('Erro ao buscar veículo:', erro);
        mostrarToast('Erro ao carregar dados do veículo.', 'error');
    }
}

// ── DELETE /veiculos/{id} — Excluir veículo ───────────────────────────────────

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