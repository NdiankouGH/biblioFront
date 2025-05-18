const Paginate = ({ pageCount, onPageChange, currentPage }) => {
    const handlePageChange = (page) => {
        onPageChange({ selected: page });
    };

    // Si pageCount est 0 ou 1, ne pas afficher la pagination
    if (pageCount <= 1) return null;

    // Limiter le nombre de pages affichées pour éviter une surcharge
    const getPageNumbers = () => {
        const maxPagesToShow = 5;
        let pages = [];
        
        if (pageCount <= maxPagesToShow) {
            // Si le nombre total de pages est inférieur à maxPagesToShow, afficher toutes les pages
            pages = Array.from({ length: pageCount }, (_, i) => i);
        } else {
            // Sinon, afficher un sous-ensemble de pages avec la page actuelle au milieu
            const halfWay = Math.floor(maxPagesToShow / 2);
            
            if (currentPage <= halfWay) {
                // Début de la pagination
                pages = Array.from({ length: maxPagesToShow }, (_, i) => i);
            } else if (currentPage >= pageCount - halfWay - 1) {
                // Fin de la pagination
                pages = Array.from({ length: maxPagesToShow }, (_, i) => pageCount - maxPagesToShow + i);
            } else {
                // Milieu de la pagination
                pages = Array.from({ length: maxPagesToShow }, (_, i) => currentPage - halfWay + i);
            }
        }
        
        return pages;
    };

    return (
        <div className="flex justify-center mt-6 mb-4">
            <nav className="flex items-center space-x-1" aria-label="Pagination">
                {/* Bouton Précédent */}
                <button
                    className={`px-3 py-2 rounded-l-md border ${currentPage === 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                    onClick={() => currentPage > 0 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    aria-label="Page précédente"
                >
                    <span className="text-sm font-medium">Précédent</span>
                </button>

                {/* Numéros de page */}
                {getPageNumbers().map(pageNumber => (
                    <button
                        key={pageNumber}
                        className={`w-9 h-9 flex items-center justify-center rounded-md ${currentPage === pageNumber
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border'}`}
                        onClick={() => handlePageChange(pageNumber)}
                        aria-label={`Page ${pageNumber + 1}`}
                        aria-current={currentPage === pageNumber ? 'page' : undefined}
                    >
                        {pageNumber + 1}
                    </button>
                ))}

                {/* Bouton Suivant */}
                <button
                    className={`px-3 py-2 rounded-r-md border ${currentPage === pageCount - 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                    onClick={() => currentPage < pageCount - 1 && handlePageChange(currentPage + 1)}
                    disabled={currentPage === pageCount - 1}
                    aria-label="Page suivante"
                >
                    <span className="text-sm font-medium">Suivant</span>
                </button>
            </nav>
        </div>
    );
};

export default Paginate;
