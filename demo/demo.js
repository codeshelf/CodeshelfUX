var endpoint = "https://admin.codeshelf.com/aldebaran";

function confirmAndExec(message) {
    if (confirm(message)) {
        deleteOrdersAndWIs();
    }
}

function deleteOrdersAndWIs() {
    $.ajax(endpoint + "/service", {
        method: 'POST',
        data: {action: "deleteorderswis"}
    });
}
