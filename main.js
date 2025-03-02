// Função para carregar as pessoas do arquivo JSON
async function loadPeople() {
  const response = await fetch('pessoas.json');
  const data = await response.json();
  return data.pessoas;
}

// Função para aleatorizar as pessoas e dividir em grupos com números aleatórios
function randomizeGroups(people, numGrupos, numPessoasPorGrupo) {
  const groups = [];
  let remainingPeople = [...people];
  
  // Aleatoriza a lista de pessoas
  remainingPeople = remainingPeople.sort(() => Math.random() - 0.5);
  
  // Se o número de pessoas por grupo for definido, divide conforme o valor
  if (numPessoasPorGrupo) {
    while (remainingPeople.length) {
      let group = [];
      for (let i = 0; i < numPessoasPorGrupo && remainingPeople.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * remainingPeople.length);
        group.push(remainingPeople.splice(randomIndex, 1)[0]);
      }
      groups.push(group);
    }
  } else {
    // Caso o número de pessoas por grupo não seja definido, divide de forma aleatória
    let totalPeople = people.length;
    let average = Math.floor(totalPeople / numGrupos);
    let remainder = totalPeople % numGrupos;
    
    // Dividir as pessoas entre os grupos, de forma aleatória
    for (let i = 0; i < numGrupos; i++) {
      let groupSize = average + (i < remainder ? 1 : 0); // Distribui o restante das pessoas
      let group = [];
      for (let j = 0; j < groupSize; j++) {
        group.push(remainingPeople.pop());
      }
      groups.push(group);
    }
  }
  
  return groups;
}

// Função para exibir os resultados na página
function displayGroups(groups) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';
  
  let groupText = '';
  
  groups.forEach((group, index) => {
    const groupDiv = document.createElement('div');
    groupDiv.classList.add('group');
    groupDiv.innerHTML = `<h3>Grupo ${index + 1} - Total: ${group.length}</h3><ul>`;
    
    group.forEach(person => {
      groupDiv.innerHTML += `<li>${person}</li>`;
    });
    
    groupDiv.innerHTML += '</ul>';
    resultDiv.appendChild(groupDiv);
    
    // Adiciona a lista do grupo para copiar
    groupText += `Grupo ${index + 1} - Total: ${group.length}\n`;
    group.forEach(person => {
      groupText += `${person}\n`;
    });
    groupText += '\n';
  });
  
  // Exibir o botão "Copiar lista"
  const copyButton = document.getElementById('copyBtn');
  copyButton.style.display = 'block';
  
  // Armazena o conteúdo para ser copiado
  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(groupText).then(() => {
    }).catch(err => {
      alert("Erro ao copiar lista: " + err);
    });
  });
}

// Função para aleatorizar quando o botão for pressionado
document.getElementById('randomizeBtn').addEventListener('click', async () => {
  const numGrupos = parseInt(document.getElementById('numGrupos').value);
  const numPessoasPorGrupo = parseInt(document.getElementById('numPessoasPorGrupo').value) || null;
  
  if (isNaN(numGrupos) || numGrupos <= 0) {
    return;
  }
  
  const people = await loadPeople();
  const groups = randomizeGroups(people, numGrupos, numPessoasPorGrupo);
  displayGroups(groups);
});