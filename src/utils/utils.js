function formatToBrCurrency(value) {
    let numberValue = value;
    if (typeof value === 'string') {
        numberValue = parseFloat(value.replace(',', '.'));
    }

    if (typeof numberValue !== 'number' || isNaN(numberValue)) {
        console.error('Valor inválido para formatação:', value);
        return '';
    }
    return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function sortProducts(products, option) {
    const sorted = [...products];
    switch (option) {
        case 'Mais vendidos':
        sorted.sort((a, b) => b.quantity - a.quantity);
        break;
        case 'Preço decrescente':
        sorted.sort((a, b) => b.price - a.price);
        break;
        case 'Preço crescente':
        sorted.sort((a, b) => a.price - b.price);
        break;
        default:
        sorted.sort((a, b) => b.id - a.id);
        break;
    }
    return sorted;
}
  
function handleError(error, message, setSnackbarMessage, setSnackbar) {
    console.error('Erro:', error);
    setSnackbarMessage(message);
    setSnackbar(true);
}
  
 
function alertComprar(product) {
    alert(`Comprar produto: ${product.name} - Funcionalidade não implementada.`);
}

export {
    formatToBrCurrency,
    sortProducts,
    handleError,
    alertComprar
}