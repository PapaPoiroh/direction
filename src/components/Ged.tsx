import React from 'react';

export default function Ged({ sections, documents, onAddSection, onAddDocument }) {
  // sections : liste des rubriques GED, documents : liste des documents
  return (
    <div className="ged">
      {sections.map(section => (
        <div key={section.id} className="ged-section">
          <h4>{section.title}</h4>
          <ul>
            {documents.filter(doc => doc.section_id === section.id).map(doc => (
              <li key={doc.id}>
                <a href={doc.url} target="_blank" rel="noopener">{doc.title}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button onClick={onAddSection}>Ajouter une rubrique</button>
      <button onClick={onAddDocument}>Ajouter un document</button>
    </div>
  );
}