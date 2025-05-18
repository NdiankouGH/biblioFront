import { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import { Button, AlertDialog, DropdownMenu, Select } from "@radix-ui/themes";
import * as Dialog from "@radix-ui/react-dialog";
import FormEditBook from "@/app/components/books/FormEdit";
import Paginate from "../Paginate";

const ListBook = ({ searchTerm = "" }) => {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [sortBy, setSortBy] = useState("publicationDate");
    const [bookAuthor, setBookAuthor] = useState("all");
    const [bookCategory, setBookCategory] = useState("all");

    const uniqueAuthors = [...new Set(books.map(book => book.author))];
const uniqueCategories = [...new Set(books.map(book => book.category))];


    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 12;
    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:8082/api/book/listBooks');
            setBooks(response.data);
        } catch (e) {
            console.error('Erreur :', e.response?.data || e.message);
            setError('Erreur lors du chargement des livres');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8082/api/book/deleteBook/${selectedBook.id}`);
            setBooks(prev => prev.filter(book => book.id !== selectedBook.id));
            setDeleteConfirmOpen(false);
        } catch (e) {
            console.error('Erreur lors de la suppression:', e.message);
        }
    };

    const filteredBooks = books.filter((book) => {
        const matchSearchTerm =
            book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchAuthor =
            bookAuthor === "all" ||
            book.author?.toLowerCase().includes(bookAuthor.toLowerCase());

        const matchCategory =
            bookCategory === "all" ||
            book.category?.toLowerCase().includes(bookCategory.toLowerCase());

        return matchSearchTerm && matchAuthor && matchCategory;
    }).sort((a, b) => {
        const dateA = new Date(a.publicationDate);
        const dateB = new Date(b.publicationDate);
        return sortBy === "acquisitionDateHight" ? dateB - dateA : dateA - dateB;
      });
      
    const pageCount = Math.ceil(filteredBooks.length / itemsPerPage);
    const paginatedBooks = filteredBooks.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    if (isLoading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-4">
            {/**Filtres */}
            <div className="flex justify-between items-center">
                <Select.Root value={bookAuthor} onValueChange={setBookAuthor}>
                    <Select.Trigger placeholder="Filtrer par auteur" />
                    <Select.Content>
                        <Select.Item value="all">Filtrer par auteur</Select.Item>
                        {uniqueAuthors.map((author) => (
                            <Select.Item key={author} value={author}>
                                {author}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>

                <Select.Root value={bookCategory} onValueChange={setBookCategory}>
                    <Select.Trigger placeholder="Filtrer par catégorie" />
                    <Select.Content>
                        <Select.Item value="all">Filtrer par catégorie</Select.Item>
                        {uniqueCategories.map((category) => (
                            <Select.Item key={category} value={category}>
                                {category}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>

                <Select.Root value={sortBy} onValueChange={setSortBy}>
                    <Select.Trigger placeholder="Trier par date" />
                    <Select.Content>
                        <Select.Item value="acquisitionDateHight">Date ↓</Select.Item>
                        <Select.Item value="acquisitionDateLow">Date ↑</Select.Item>
                    </Select.Content>
                </Select.Root>
            </div>
            {/* Tableau */}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            {['Titre', 'Auteur', 'Description', 'ISBN', 'Éditeur', 'Date de publication', 'Catégorie', 'Total', 'Disponibles', 'Actions']
                                .map(header => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{header}</th>
                                ))}
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedBooks.map((book) => (
                            <tr key={book.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{book.title}</td>
                                <td className="px-6 py-4">{book.author}</td>
                                <td className="px-6 py-4 max-w-xs truncate">{book.description}</td>
                                <td className="px-6 py-4">{book.isbn}</td>
                                <td className="px-6 py-4">{book.publisher}</td>
                                <td className="px-6 py-4">{new Date(book.publicationDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{book.category}</td>
                                <td className="px-6 py-4">{book.totalCopies}</td>
                                <td className="px-6 py-4">{book.availableCopies}</td>
                                <td className="px-6 py-4 flex justify-center">
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger asChild>
                                            <Button variant="soft" size="icon">...</Button>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Content>
                                            <DropdownMenu.Item onClick={() => {
                                                setSelectedBook(book);
                                                setViewDialogOpen(true);
                                            }}>
                                                <FaEye className="mr-2" /> Voir
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item onClick={() => {
                                                setSelectedBook(book);
                                                setEditDialogOpen(true);
                                            }}>
                                                <FaEdit className="mr-2" /> Modifier
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Separator />
                                            <DropdownMenu.Item color="red" onClick={() => {
                                                setSelectedBook(book);
                                                setDeleteConfirmOpen(true);
                                            }}>
                                                <FaTrash className="mr-2" /> Supprimer
                                            </DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <Paginate
                pageCount={pageCount}
                onPageChange={handlePageChange}
                currentPage={currentPage}
            />

            {/* Dialog Edition */}
            <Dialog.Root open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/30" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md bg-white p-6 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2">
                        <Dialog.Title className="text-lg font-bold">Modifier Livre</Dialog.Title>
                        <Dialog.Description className="text-sm text-gray-500 mb-4">Modifie les informations du livre</Dialog.Description>
                        {selectedBook && (
                            <FormEditBook
                                selectedBook={selectedBook}
                                onSuccess={() => {
                                    setEditDialogOpen(false);
                                    fetchBooks(); // refresh
                                }}
                            />
                        )}
                        <Dialog.Close asChild>
                            <Button variant="soft" className="mt-4 w-full">Annuler</Button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Dialog Suppression */}
            <AlertDialog.Root open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialog.Content>
                    <AlertDialog.Title>Supprimer le livre</AlertDialog.Title>
                    <AlertDialog.Description>
                        Es-tu sûr de vouloir supprimer "{selectedBook?.title}" ?
                    </AlertDialog.Description>
                    <div className="flex justify-end gap-2 mt-4">
                        <AlertDialog.Cancel asChild>
                            <Button variant="soft">Annuler</Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                            <Button color="red" onClick={handleDelete}>Supprimer</Button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Root>


            {/* Dialog Details livre*/}
            {/* Dialog Détails Livre */}
            <Dialog.Root open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md bg-white p-6 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2 space-y-4">
                        <Dialog.Title className="text-lg font-bold">Détails du Livre</Dialog.Title>
                        <Dialog.Description className="text-sm text-gray-500 mb-4">Informations du livre sélectionné</Dialog.Description>

                        {selectedBook && (
                            <div className="space-y-3">
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Titre</span>
                                    <span className="text-gray-800">{selectedBook.title}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Description</span>
                                    <span className="text-gray-800">{selectedBook.description}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Catégorie</span>
                                    <span className="text-gray-800">{selectedBook.category}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Auteur</span>
                                    <span className="text-gray-800">{selectedBook.author}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">ISBN</span>
                                    <span className="text-gray-800">{selectedBook.isbn}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Éditeur</span>
                                    <span className="text-gray-800">{selectedBook.publisher}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Date Publication</span>
                                    <span className="text-gray-800">{new Date(selectedBook.publicationDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Total Exemplaires</span>
                                    <span className="text-gray-800">{selectedBook.totalCopies}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="font-medium text-gray-600">Disponibles</span>
                                    <span className="text-gray-800">{selectedBook.availableCopies}</span>
                                </div>
                            </div>
                        )}

                        <Dialog.Close asChild>
                            <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md">
                                Fermer
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

        </div>
    );
};

export default ListBook;
