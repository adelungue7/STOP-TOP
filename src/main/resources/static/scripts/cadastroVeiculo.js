const apiUrl = '/veiculos';
        
document.addEventListener('DOMContentLoaded', () => {
    // Carrega a tabela assim que a página abre
    carregarVeiculos();

    // Intercepta o envio do formulário
    document.getElementById('formVeiculo').addEventListener('submit', function(e) {
        e.preventDefault(); // Impede o recarregamento da página
        salvarVeiculo();
    });

    // Cancela a edição e limpa os campos
    document.getElementById('btnCancelarEdicao').addEventListener('click', limparFormulario);
});

// --- FUNÇÕES CRUD --- //

// Buscar e listar todos os veículos
function carregarVeiculos() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('tabelaVeiculosBody');
            tbody.innerHTML = ''; // Limpa a tabela atual
            
            data.forEach(veiculo => {
                const tr = document.createElement('tr');
                
                // Fallback de imagem: caso o usuário não envie uma URL, usa um placeholder
                const imgSource = veiculo.imagemVeiculo ? veiculo.imagemVeiculo : 'https://via.placeholder.com/50x50?text=Carro';

                tr.innerHTML = `
                    <td>${veiculo.id}</td>
                    <td><img src="${imgSource}" alt="Veículo" style="width: 50px; height: 50px; border-radius: 4px; object-fit: cover;"></td>
                    <td>${veiculo.nomeVeiculo}</td>
                    <td>${veiculo.placa}</td>
                    <td>${veiculo.nomeProprietario}</td>
                    <td>${veiculo.descricao || '-'}</td>
                    <td style="display: flex; gap: 0.5rem; justify-content: flex-start; padding-top: 1.5rem;">
                        <button onclick="editarVeiculo(${veiculo.id})" style="background: #f1c40f; border:none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Editar</button>
                        <button onclick="excluirVeiculo(${veiculo.id})" style="background: #e74c3c; color: white; border:none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Excluir</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Erro ao carregar veículos:', error));
}

// Cadastrar ou atualizar veículo
function salvarVeiculo() {
    const id = document.getElementById('veiculoId').value;
    const veiculo = {
        nomeVeiculo: document.getElementById('nomeVeiculo').value,
        nomeProprietario: document.getElementById('nomeProprietario').value,
        imagemVeiculo: document.getElementById('imagemVeiculo').value,
        placa: document.getElementById('placaVeiculo').value,
        descricao: document.getElementById('descricaoVeiculo').value
    };

    // Define se é criação (POST) ou atualização (PUT) baseado no ID oculto
    const metodo = id ? 'PUT' : 'POST';
    const urlDestino = id ? `${apiUrl}/${id}` : apiUrl;

    fetch(urlDestino, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(veiculo)
    })
    .then(async response => {
        if (!response.ok) {
            // Captura a mensagem de erro da regra de negócio enviada pelo backend
            const errorMsg = await response.text();
            throw new Error(errorMsg);
        }
        return response.json();
    })
    .then(() => {
        alert(id ? 'Veículo atualizado com sucesso!' : 'Veículo cadastrado com sucesso!');
        limparFormulario();
        carregarVeiculos(); // Atualiza a tabela com o novo dado
    })
    .catch(error => {
        alert('Erro na operação:\n' + error.message);
    });
}

// Preparar formulário para edição
function editarVeiculo(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(veiculo => {
            // Preenche os campos do formulário
            document.getElementById('veiculoId').value = veiculo.id;
            document.getElementById('nomeVeiculo').value = veiculo.nomeVeiculo;
            document.getElementById('nomeProprietario').value = veiculo.nomeProprietario;
            document.getElementById('imagemVeiculo').value = veiculo.imagemVeiculo;
            document.getElementById('placaVeiculo').value = veiculo.placa;
            document.getElementById('descricaoVeiculo').value = veiculo.descricao;

            // Altera botões para modo de edição
            document.getElementById('btnSalvar').textContent = 'Atualizar Veículo';
            document.getElementById('btnCancelarEdicao').style.display = 'block';
            
            // Rola a página para cima (onde está o formulário)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(error => alert('Erro ao buscar dados do veículo.'));
}

// Deletar veículo
function excluirVeiculo(id) {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Veículo excluído com sucesso!');
                carregarVeiculos(); // Recarrega a tabela sem recarregar a página inteira
            } else {
                alert('Erro ao excluir o veículo.');
            }
        })
        .catch(error => console.error('Erro ao excluir:', error));
    }
}

// Reseta o estado do formulário para criação
function limparFormulario() {
    document.getElementById('formVeiculo').reset();
    document.getElementById('veiculoId').value = '';
    
    // Retorna os botões ao estado original
    document.getElementById('btnSalvar').textContent = 'Adicionar Veículo';
    document.getElementById('btnCancelarEdicao').style.display = 'none';
}