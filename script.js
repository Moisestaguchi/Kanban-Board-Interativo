// referências html
const $modal    = document.getElementById('taskModal'); // Modal/formulario todo
//forms valores
const $titleInput = document.getElementById('taskTitle');
const $descriptionInput  = document.getElementById('taskDesc');
const $dateInput   = document.getElementById('taskDate');
const $priorityInput = document.getElementById('priority');
const $columnInput = document.getElementById('column');
const $idInput = document.getElementById('idInput');
//colunas
const columnAberto = document.querySelector('.column.aberto .cards-column');
var $listAll = [];
// editar title e btn no Forms
const $createModelTitle = document.getElementById('creationModelTitle');
const $editModelTitle = document.getElementById('editModelTitle');

const $createModelBtn = document.getElementById('creationModelBtn');
const $editModelBtn = document.getElementById('editModelBtn');



//abrir modal
function openModal(id){
    $modal.classList.remove('hidden');
    //verificar se há um id para edição do card
    if(id){
        //saber a  posição do arrey 
        const index = $listAll.findIndex(function(item){
            return item.id == id;
        });

        // qunado entrar na condição o display edit fica block
        
        $editModelTitle.style.display = "block";
        $editModelBtn.style.display = "block";

        $createModelBtn.style.display = "none";
        $createModelTitle.style.display = "none";


            

    // pega os valores dos inputs
    const valorCard = $listAll[index];  

    // Preenche os inputs
    $idInput.value = valorCard.id;
    $titleInput.value = valorCard.title;
    $descriptionInput.value = valorCard.description;
    $priorityInput.value = valorCard.priority;
    $dateInput.value = valorCard.date;
    $columnInput.value = valorCard.column;



    }else{

        $createModelTitle.style.display = "block";
        $createModelBtn.style.display = "block";

        $editModelTitle.style.display = "none";
        $editModelBtn.style.display = "none";
    }
    

}

// fechar modal
function closeModal(){
    $modal.classList.add('hidden');

    $idInput.value = "";
    $titleInput.value = "";
    $descriptionInput.value = "";
    $dateInput.value = "";
    $priorityInput.value = "";
    $columnInput.value = "";
}
// cria os cards 
function createCard() {
    // limpa todo o conteúdo anterior das colunas
    document.querySelectorAll('.cards-column').forEach(col => col.innerHTML = '');
  
    // pra cada item em $listAll, define columnStatus DENTRO do forEach
    $listAll.forEach(item => {
      const columnStatus = document.querySelector(
        `.column[data-status="${item.column}"] .cards-column`
      );
  
      const cardHTML = `
        <div 
        id="${item.id}" 
        class="card" 
        draggable="true" 
        ondragstart="dragstartHandler(event)"

        >
          <div class="card-header">
            <h1><b>${item.title}</b></h1>
            <span class="badge priority-${item.priority.toLowerCase()}">
              ${item.priority}
            </span>
          </div>
          <div class="card-description">
            <b>Descrição:</b>
            <p>${item.description}</p>
          </div>

          ${item.date ? `
            <div class="card-date">
              <b>Data de entrega:</b>
              <small>${new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR')}</small>
            </div>
          ` : ''}
          

          <div class="btnsForm">
            <button class="btn editar" onclick="openModal(${item.id})">
              editar
            </button>
            <button class="btn excluir" onclick="deleteTask(${item.id})">
            excluir
            
              
            </button>
          </div>
        </div>
      `;
  
      //  injeta o HTML na coluna correta
      columnStatus.innerHTML += cardHTML;
    });
  }
  
// função para pegar od dados dos inputs
function createTask(){ 

    if (!validateForm()) return;

    const newTask = {

        id: Math.floor(Math.random()*707070),
        title: $titleInput.value,
        description: $descriptionInput.value,
        priority: $priorityInput.value,
        date: $dateInput.value,
        column: $columnInput.value,
    }
    $listAll.push(newTask); // adiciona os objetos a lista de cards

    closeModal();
    createCard();
}

function updateTask(){

    if (!validateForm()) return;

    //criasse uma lista nova a partir dos novos valores do input
    const upTask = {
        id: $idInput.value,
        title: $titleInput.value,
        description: $descriptionInput.value,
        priority: $priorityInput.value,
        date: $dateInput.value,
        column: $columnInput.value,
    }
    //pegamos o index/valor dentro da lista para saber oq precisamos mudar
    const index = $listAll.findIndex(function(item){
        return item.id == $idInput.value;
    });
    //passando o novo valor
    $listAll[index] = upTask;

    closeModal();
    createCard();
}

function columnPosition(itemId, columnId) {
    if(itemId && columnId){
        $listAll = $listAll.map((item) => {
        
        if (itemId != item.id)return item;

        return{
            ...item,
            column: columnId,
        };
    });
    }

    
}

function deleteTask(id) {
    //pegamos o index/valor dentro da lista
    const index = $listAll.findIndex(function(item) {
        return item.id == id;
    });

    if (index !== -1) {
        $listAll.splice(index, 1); // remove do array
        createCard(); // atualiza a tela
    }
}
// função criada para quando ativar o ondraggstart 
function dragstartHandler(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
  }
  
  function dragoverHandler(ev) {
    ev.preventDefault();
  }
  

  function dropHandler(ev) {
    ev.preventDefault();
  
    // 1) Pega o ID do card que foi arrastado
    const cardId = ev.dataTransfer.getData("text/plain");
    const cardEl = document.getElementById(cardId);
  
    // 2) Encontra a área .cards-column onde soltou
    const dropArea = ev.target.closest('.cards-column');
    if (!dropArea) return;
  
    // 3) Move o elemento no DOM (você vê o efeito imediatamente)
    dropArea.appendChild(cardEl);
  
    // 4) Descobre o novo status da coluna
    const newStatus = dropArea.closest('.column').dataset.status;
    console.log(`Card ${cardId} movido para status ${newStatus}`);
  
    // 5) Atualiza o seu array de dados
    columnPosition(cardId, newStatus);
  
    // 6) Remove o highlight (às vezes o dragLeave não dispara)
    dropArea.classList.remove('column--highlight');
  }
  

  const dragEnter = ev => {
    const target = ev.target;
    if (target.classList.contains("cards-column")) {
      target.classList.add("column--highlight");
    }
  };
  
  const dragLeave = ev => {
    const target = ev.target;
    if (target.classList.contains("cards-column")) {
      target.classList.remove("column--highlight");
    }
} 

// coreção de erro Form
function validateForm() {
    let valid = true;
  
    // Limpa od erros 
    ['title','desc','priority','column'].forEach(field => {
      document.getElementById(`error-${field}`).textContent = '';
    });
  
    
    if (!$titleInput.value.trim()) {
      document.getElementById('error-title').textContent = 'Título é obrigatório.';
      valid = false;
    }
  
    
    if (!$descriptionInput.value.trim()) {
      document.getElementById('error-desc').textContent = 'Descrição é obrigatória.';
      valid = false;
    }
  
    
    if (!$priorityInput.value) {
      document.getElementById('error-priority').textContent = 'Selecione uma prioridade.';
      valid = false;
    }
  
    
    if (!$columnInput.value) {
      document.getElementById('error-column').textContent = 'Selecione uma coluna.';
      valid = false;
    }
  
    return valid;
  }
