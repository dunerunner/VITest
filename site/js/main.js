'use strict';
$(document).ready(function () {
    todoListModule.init();
});
var todoListModule = (function () {
    function getJson(url, type, callback, sentData) {
        if (type === 'POST') {
            mockPostRequest(url, callback, sentData);
            return;
        }
        $.ajax({
            url: "json/" + url,
            type: type,
            dataType: 'json'
        })
                .done(function (data) {
                    if (sentData && sentData.title) {
                        data.title = sentData.title;
                        callback(data);
                        return;
                    }
                    callback(data);
                })
                .fail(function () {
                    console.warn("Error while processing ajax request");
                });
    }
    function mockPostRequest(url, callback, sentData) {
        console.log('Mocking POST Request');
        $.ajax({
            url: "json/" + url,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(sentData)
        })
                .done(function () {
                    console.log('POST Request SuccessFul');
                })
                .fail(function () {
                    console.log('Error processing POST Request (expected)');
                    getJson(url, 'GET', callback, sentData);
                });
    }
    function itemTemplate(item) {
        var formatDate = item.date.split('-').reverse().join('.');
        var tpl = '<li id="' + item.id + '"class="b-todo-item"><span class="b-todo-item__title">' + item.title + '</span><span class="b-todo-item__date">' + formatDate + '</span><a class="b-todo-item__author" href="' + item.url + '">' + item.author + '</a><a class="b-todo-item__removebtn" href="#">Remove</a></li>';
        return tpl;
    }
    function appendItems(items) {
        items.forEach(function (element) {
            $('#todoList').append(itemTemplate(element));
        });
    }
    function addItem(data) {
        $('#todoList').append(itemTemplate(data));
    }
    function removeItem(data) {
        console.log('Item removed. Server returned status: ' + data.status);
    }
    function init() {
        getJson('data.json', 'GET', appendItems);
        $('#todoAddBtn').on('click', function (e) {
            var newTitle = $('#todoAddInput').val();
            if ((newTitle).trim().length < 1) {
                console.warn('Empty input field!');
                return;
            }
            e.preventDefault;
            e.stopPropagation();
            getJson('save.json', 'POST', addItem, {title: newTitle});
        });
        $('#todoList').on('click', '.b-todo-item__removebtn', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var idToRemove = $(this).parent().attr('id');
            $(this).parent().remove();
            getJson('delete.json', 'POST', removeItem, {id: idToRemove});
        });
    }
    return {
        init: init
    };
})();