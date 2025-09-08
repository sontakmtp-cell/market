import React, { useState } from 'react';
import { cn } from '../../../utils/cn';

const PortfolioSection = ({ portfolio }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  if (!portfolio?.length) return null;

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <section className="bg-card rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Portfolio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.map((item, index) => (
            <div
              key={index}
              className="group relative cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-muted">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5">
                    <svg
                      className="h-12 w-12 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <h3 className="font-medium text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Item Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-card rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedItem.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedItem.category}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {selectedItem.image && (
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-6">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              <div className="prose prose-sm max-w-none">
                <p>{selectedItem.description}</p>
              </div>

              {selectedItem.technologies?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Công nghệ sử dụng</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.links?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Liên kết</h4>
                  <div className="flex flex-wrap gap-4">
                    {selectedItem.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-primary hover:text-primary/80"
                      >
                        {link.icon && (
                          <span className="mr-1">{link.icon}</span>
                        )}
                        {link.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioSection;
