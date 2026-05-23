document.addEventListener('DOMContentLoaded', listarClientes);

function mostrarToast(mensagem, tipo = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = mensagem;
    toast.className = `toast show ${tipo}`;
    setTimeout(() => { toast.className = 'toast'; }, 3000);
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarCPF(cpf) {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.length === 11;
}

function cadastrarCliente() {
    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const dataNascimento = document.getElementById('dataNascimento').value;
    const tipoPlano = document.getElementById('tipoPlano').value;

    if (!nome || !cpf || !email || !telefone || !dataNascimento || !tipoPlano) {
        mostrarToast('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }

    if (!validarCPF(cpf)) {
        mostrarToast('CPF inválido. Deve conter 11 dígitos.', 'error');
        return;
    }

    if (!validarEmail(email)) {
        mostrarToast('E-mail inválido.', 'error');
        return;
    }

    const cliente = { nome, cpf, email, telefone, endereco, dataNascimento, tipoPlano };

    fetch('/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
    })
    .then(response => {
        if (response.ok) {
            mostrarToast('Cliente cadastrado com sucesso!');
            limparCampos();
            listarClientes();
        } else {
            response.text().then(text => mostrarToast(text || 'Erro ao cadastrar cliente.', 'error'));
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        mostrarToast('Erro de conexão com o servidor.', 'error');
    });
}

function listarClientes() {
    fetch('/clientes')
        .then(response => response.json())
        .then(clientes => {
            const tbody = document.getElementById('tabela-body');
            tbody.innerHTML = '';

            if (clientes.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">Nenhum cliente cadastrado.</td></tr>';
                return;
            }

            clientes.forEach(cliente => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${cliente.nome}</td>
                    <td>${cliente.cpf}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.telefone}</td>
                    <td>${cliente.endereco || '-'}</td>
                    <td>${cliente.tipoPlano}</td>
                    <td>
                        <button class="btn-delete" onclick="deletarCliente('${cliente.cpf}')">Excluir</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
            const tbody = document.getElementById('tabela-body');
            tbody.innerHTML = '<tr><td colspan="7">Erro ao carregar clientes.</td></tr>';
        });
}

function deletarCliente(cpf) {
    if (confirm('Deseja realmente excluir este cliente?')) {
        fetch(`/clientes/${cpf}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    mostrarToast('Cliente excluído com sucesso!');
                    listarClientes();
                } else {
                    mostrarToast('Erro ao excluir cliente.', 'error');
                }
            });
    }
}

function limparCampos() {
    document.getElementById('nome').value = '';
    document.getElementById('cpf').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('endereco').value = '';
    document.getElementById('dataNascimento').value = '';
    document.getElementById('tipoPlano').value = '';
}
