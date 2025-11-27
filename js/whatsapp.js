const whatsappNumber = "+919605514944";   
const message = "Hello, I want to know more about the orchids."; 

const whatsappLink = document.getElementById("whatsappLink");
const popupWhatsapp = document.getElementById("popupWhatsapp");


if (whatsappLink) {  
    whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

if (popupWhatsapp) {  
    popupWhatsapp.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}