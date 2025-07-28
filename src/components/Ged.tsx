import React from 'react';

type Section = {
  id: string | number;
  title: string;
};

type Document = {
  id: string | number;
  section_id: string | number;
  url: string;
  title: string;
};

interface GedProps {
  sections: Section[];
  documents: Document[];
  onAddSection: () => void;
  onAddDocument: () => void;
}

export default function Ged({ sections, documents, onAddSection, onAddDocument }: GedProps) {
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
