document.addEventListener('DOMContentLoaded', () => {
    listarVeiculos();
    const form = document.getElementById('formVeiculo');
    form.addEventListener('submit', salvarVeiculo);
    
    document.getElementById('btnCancelarEdicao').addEventListener('click', cancelarEdicao);
});

function mostrarToast(mensagem, tipo = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = mensagem;
    toast.className = `toast show ${tipo}`;
    setTimeout(() => { toast.className = 'toast'; }, 3000);
}

function salvarVeiculo(e) {
    e.preventDefault();

    const id = document.getElementById('veiculoId').value;
    const nomeVeiculo = document.getElementById('nomeVeiculo').value.trim();
    const nomeProprietario = document.getElementById('nomeProprietario').value.trim();
    const placa = document.getElementById('placaVeiculo').value.trim().toUpperCase();
    const vaga = document.getElementById('vagaVeiculo').value.trim();
    const descricao = document.getElementById('descricaoVeiculo').value.trim();

    if (!nomeVeiculo || !nomeProprietario || !placa || !vaga) {
        mostrarToast('Nome, Proprietário, Placa e Vaga são obrigatórios.', 'error');
        return;
    }

    const veiculo = { nomeVeiculo, nomeProprietario, placa, vaga, descricao };
    const url = id ? `/veiculos/${id}` : '/veiculos';
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(veiculo)
    })
    .then(response => {
        if (response.ok) {
            mostrarToast(id ? 'Veículo atualizado!' : 'Veículo cadastrado!');
            cancelarEdicao();
            listarVeiculos();
        } else {
            response.text().then(text => mostrarToast(text || 'Erro ao salvar veículo.', 'error'));
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        mostrarToast('Erro de conexão.', 'error');
    });
}

function listarVeiculos() {
    fetch('/veiculos')
        .then(res => res.json())
        .then(veiculos => {
            const tbody = document.getElementById('tabelaVeiculosBody');
            tbody.innerHTML = '';

            if (veiculos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6">Nenhum veículo cadastrado.</td></tr>';
                return;
            }

            veiculos.forEach(v => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${v.vaga || '-'}</td>
                    <td>${v.nomeVeiculo}</td>
                    <td><span class="tag-placa">${v.placa}</span></td>
                    <td>${v.nomeProprietario}</td>
                    <td>${v.descricao || '-'}</td>
                    <td>
                        <button class="btn-edit" onclick="editarVeiculo(${v.id})">Editar</button>
                        <button class="btn-delete" onclick="deletarVeiculo(${v.id})">Excluir</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        });
}

function editarVeiculo(id) {
    fetch(`/veiculos/${id}`)
        .then(res => res.json())
        .then(v => {
            document.getElementById('veiculoId').value = v.id;
            document.getElementById('nomeVeiculo').value = v.nomeVeiculo;
            document.getElementById('nomeProprietario').value = v.nomeProprietario;
            document.getElementById('placaVeiculo').value = v.placa;
            document.getElementById('vagaVeiculo').value = v.vaga || '';
            document.getElementById('descricaoVeiculo').value = v.descricao || '';

            document.getElementById('editModeBanner').style.display = 'block';
            document.getElementById('btnCancelarEdicao').style.display = 'block';
            document.getElementById('btnSalvar').textContent = 'Atualizar Veículo';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
}

function cancelarEdicao() {
    document.getElementById('formVeiculo').reset();
    document.getElementById('veiculoId').value = '';
    document.getElementById('editModeBanner').style.display = 'none';
    document.getElementById('btnCancelarEdicao').style.display = 'none';
    document.getElementById('btnSalvar').textContent = 'Adicionar Veículo';
}

function deletarVeiculo(id) {
    if (confirm('Excluir este veículo?')) {
        fetch(`/veiculos/${id}`, { method: 'DELETE' })
            .then(res => {
                if (res.ok) {
                    mostrarToast('Veículo excluído!');
                    listarVeiculos();
                }
            });
    }
}
