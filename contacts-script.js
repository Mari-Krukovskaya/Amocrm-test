const limit = 25;
let page = 1;
let getContactsListQueryUrl = 'https://marikrukovskaya97.amocrm.ru/api/v4/contacts';
let createTaskUrl = 'https://marikrukovskaya97.amocrm.ru/api/v4/tasks';

function getContacts() {
    $.ajax({
        url: getContactsListQueryUrl,
        method: 'GET',
        data: {
            limit: limit,
            with: 'leads',
            page: page
        }
    }).done(function(data) {
        if (!!data) {
            const contacts = data._embedded.contacts;

           if (contacts.length > 0) {
            contacts.forEach(function(contact) {
               

                if (contact._embedded.leads.length === 0) {
                    createTask(contact.id, 'Контакт без сделок');
                }
            });
            page++;
            getContacts();
           } else {
            console.log('Контактов больше нет');
            return false;
           } 
         } else {
            console.log('Контактов нет');
            return false;
           }

        }).fail(function(data) {
            console.log('Что-то пошло не так c получением контактов');
            console.log(data);
            return false;
        });
}

function createTask(contactId, taskText) {
    const taskData = {
        task_Type_id: 1,
        text: taskText,
        enity_id: contactId,
        enity_type: 'contacts'
    };
    $.ajax({
        url: createTaskUrl,
        method: 'POST',
        data: JSON.stringify(taskData),
        contentType: 'application/json'
    }).done(function(data) {
        console.log('Задача создана для контакта с ID ' + contactId);
    }).fail(function(data) {
        console.log('Ошибка при создании задачи для контакта с ID ' + contactId);
        console.log(data);
    });
}
getContacts();


