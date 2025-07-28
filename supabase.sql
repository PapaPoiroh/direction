-- Table des utilisateurs
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  name text,
  role text check (role in ('directeur', 'adjoint_pedagogie', 'adjoint_vie_scolaire'))
);

-- Table des tâches
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  due_date date,
  status text check (status in ('A Faire', 'En Cours', 'En Attente', 'Terminé')) default 'A Faire',
  created_by uuid references users(id),
  assigned_to uuid references users(id),
  checklist jsonb,
  attachments jsonb,
  comments jsonb,
  created_at timestamp default now()
);

-- Table des idées
create table ideas (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  created_by uuid references users(id),
  created_at timestamp default now()
);

-- Table des rubriques GED
create table ged_sections (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  parent_id uuid references ged_sections(id)
);

-- Table des documents GED
create table ged_documents (
  id uuid primary key default uuid_generate_v4(),
  section_id uuid references ged_sections(id),
  title text,
  url text,
  uploaded_by uuid references users(id),
  uploaded_at timestamp default now()
);

-- Table pour lier tâches et agenda
create table agenda_items (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid references tasks(id),
  agenda_date date,
  exported boolean default false
);