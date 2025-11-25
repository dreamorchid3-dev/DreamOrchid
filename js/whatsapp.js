const whatsappNumber = "+919605514944";   
const message = "Hello, I want to know more about the orchids."; 

const whatsappLink = document.getElementById("whatsappLink");

if (whatsappLink) {  
    whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}