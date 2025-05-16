import React, { useState, useEffect } from 'react';
import { categories } from '../../data/mockData';
import { Book } from '../../types';
import { X } from 'lucide-react';

interface BookFormProps {
  initialBook?: Book;
  onSubmit: (bookData: Omit<Book, 'id' | 'addedAt'>) => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({
  initialBook,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Book, 'id' | 'addedAt'>>({
    title: '',
    author: '',
    isbn: '',
    category: categories[0],
    quantity: 1,
    availableQuantity: 1,
    shelfLocation: '',
    coverImage: '',
  });

  useEffect(() => {
    if (initialBook) {
      // If editing an existing book, pre-fill the form
      const { id, addedAt, ...bookData } = initialBook;
      setFormData(bookData);
    }
  }, [initialBook]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'quantity') {
      const quantity = parseInt(value) || 0;
      setFormData((prev) => ({
        ...prev,
        quantity,
        // When editing a book, don't automatically update availableQuantity if it's less than the total
        // This preserves the books that are currently borrowed
        availableQuantity: initialBook 
          ? Math.min(quantity, initialBook.availableQuantity + (quantity - initialBook.quantity))
          : quantity,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading font-semibold text-gray-800">
            {initialBook ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author*
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                ISBN*
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity*
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="shelfLocation" className="block text-sm font-medium text-gray-700 mb-1">
                Shelf Location*
              </label>
              <input
                type="text"
                id="shelfLocation"
                name="shelfLocation"
                value={formData.shelfLocation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
                placeholder="e.g., A1-23"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image URL (optional)
              </label>
              <input
                type="url"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {initialBook ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;