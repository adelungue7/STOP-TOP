 // URL base da API — ajuste a porta se necessário
    const API_URL = 'http://localhost:8080/clientes';
 
    // ── Utilitários ─────────────────────────────────────────
 
    function mostrarToast(mensagem, tipo = 'success') {
      const toast = document.getElementById('toast');
      toast.textContent = mensagem;
      toast.className = 'toast ' + tipo + ' show';
      setTimeout(() => { toast.className = 'toast'; }, 3000);
    }
 
    function badgePlano(plano) {
      if (!plano) return '-';
      const isMensal = plano === 'MENSAL';
      const cls   = isMensal ? 'badge-mensal' : 'badge-diario';
      const label = isMensal ? 'Mensal' : 'Diário';
      return `<span class="badge ${cls}">${label}</span>`;
    }
 
    function limparFormulario() {
      ['nome', 'cpf', 'email', 'telefone', 'endereco', 'dataNascimento'].forEach(id => {
        document.getElementById(id).value = '';
      });
      document.getElementById('tipoPlano').value = '';
      document.getElementById('img-nome').value  = '';
    }
 
    // ── Carregar lista de clientes — GET /clientes ───────────
 
    async function carregarClientes() {
      const tbody = document.getElementById('tabela-body');
      tbody.innerHTML = '<tr class="table-status"><td colspan="7">Carregando clientes...</td></tr>';
 
      try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error('Erro na resposta do servidor');
 
        const clientes = await resposta.json();
 
        if (clientes.length === 0) {
          tbody.innerHTML = '<tr class="table-status"><td colspan="7">Nenhum cliente cadastrado ainda.</td></tr>';
          return;
        }
 
        tbody.innerHTML = clientes.map(c => `
          <tr>
            <td>${c.nome      || '-'}</td>
            <td>${c.cpf       || '-'}</td>
            <td>${c.email     || '-'}</td>
            <td>${c.telefone  || '-'}</td>
            <td>${c.endereco  || '-'}</td>
            <td>${badgePlano(c.tipoPlano)}</td>
            <td>
              <button class="btn-delete" onclick="deletarCliente('${c.cpf}')" title="Remover cliente">
                &#128465;
              </button>
            </td>
          </tr>
        `).join('');
 
      } catch (erro) {
        console.error(erro);
        tbody.innerHTML = '<tr class="table-status"><td colspan="7">Erro ao carregar. Verifique se o backend está rodando.</td></tr>';
      }
    }
 
    // ── Cadastrar cliente — POST /clientes ───────────────────
 
    async function cadastrarCliente() {
      const nome           = document.getElementById('nome').value.trim();
      const cpf            = document.getElementById('cpf').value.trim();
      const email          = document.getElementById('email').value.trim();
      const telefone       = document.getElementById('telefone').value.trim();
      const endereco       = document.getElementById('endereco').value.trim();
      const dataNascimento = document.getElementById('dataNascimento').value;
      const tipoPlano      = document.getElementById('tipoPlano').value;
 
      if (!nome || !cpf || !tipoPlano) {
        mostrarToast('Preencha Nome, CPF e Plano.', 'error');
        return;
      }
 
      const corpo = { nome, cpf, email, telefone, endereco, dataNascimento, tipoPlano };
 
      try {
        const resposta = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(corpo)
        });
 
        if (!resposta.ok) throw new Error('Erro ao cadastrar');
 
        mostrarToast('Cliente cadastrado com sucesso!');
        limparFormulario();
        carregarClientes();
 
      } catch (erro) {
        console.error(erro);
        mostrarToast('Erro ao cadastrar cliente.', 'error');
      }
    }
 
    // ── Deletar cliente — DELETE /clientes/{cpf} ─────────────
 
    async function deletarCliente(cpf) {
      if (!confirm('Deseja realmente remover este cliente?')) return;
 
      try {
        const resposta = await fetch(`${API_URL}/${cpf}`, { method: 'DELETE' });
        if (!resposta.ok) throw new Error('Erro ao deletar');
 
        mostrarToast('Cliente removido.');
        carregarClientes();
 
      } catch (erro) {
        console.error(erro);
        mostrarToast('Erro ao remover cliente.', 'error');
      }
    }
 
    // ── Listener do input de arquivo ─────────────────────────
 
    document.getElementById('img-file').addEventListener('change', function () {
      const arquivo = this.files[0];
      document.getElementById('img-nome').value = arquivo ? arquivo.name : '';
    });
 
    // ── Inicialização ─────────────────────────────────────────
    carregarClientes();