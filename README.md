# Project Collaboration System API (Studi Kasus 6)

Backend NestJS + TypeORM + PostgreSQL untuk kolaborasi proyek: project, anggota, tugas, komentar, dan metadata file.

## Menjalankan

```
docker compose up -d
npm install
npm run start:dev
```

- API: http://localhost:3000
- Swagger (dokumentasi + coba endpoint): http://localhost:3000/docs
- Konfigurasi database ada di file `.env` (salinan dari `.env.example`).
- Tabel dibuat otomatis (`DB_SYNCHRONIZE=true`).

## Entitas & Relasi

| Entitas | Tabel | Keterangan |
|---|---|---|
| Project | projects | name, description, status |
| Member | members | name, email (unique) |
| ProjectMember | project_members | tabel penghubung Project <-> Member (many-to-many), punya `role` |
| Task | tasks | title, status, priority, dueDate, projectId, assigneeId |
| Comment | comments | content, taskId, authorId |
| FileMetadata | files | fileName, mimeType, size, url, projectId, uploadedById |

Relasi:
- Project <-> Member: many-to-many lewat `ProjectMember` (unique per pasangan projectId + memberId)
- Project 1 -> N Task
- Task 1 -> N Comment
- Project 1 -> N FileMetadata

## Endpoint

### Projects
| Method | URL | Fungsi |
|---|---|---|
| POST | /projects | buat project |
| GET | /projects | daftar project (+ memberCount, taskCount) |
| GET | /projects/:id | detail project |
| PATCH | /projects/:id | ubah project |
| DELETE | /projects/:id | hapus project (tugas, komentar, file ikut terhapus) |

### Members
| Method | URL | Fungsi |
|---|---|---|
| POST | /members | buat member |
| GET | /members | daftar member |
| GET | /members/:id | detail member |
| PATCH | /members/:id | ubah member |
| DELETE | /members/:id | hapus member |

### Anggota Project
| Method | URL | Fungsi |
|---|---|---|
| POST | /projects/:projectId/members | tambah anggota ke project |
| GET | /projects/:projectId/members | daftar anggota project |
| PATCH | /projects/:projectId/members/:memberId | ubah role anggota |
| DELETE | /projects/:projectId/members/:memberId | keluarkan anggota |

### Tasks
| Method | URL | Fungsi |
|---|---|---|
| POST | /projects/:projectId/tasks | buat tugas |
| GET | /projects/:projectId/tasks?status=&priority=&assigneeId= | daftar tugas (filter opsional) |
| GET | /tasks/:id | detail tugas (+ commentCount) |
| PATCH | /tasks/:id | ubah tugas / status / assignee |
| DELETE | /tasks/:id | hapus tugas |

### Comments
| Method | URL | Fungsi |
|---|---|---|
| POST | /tasks/:taskId/comments | tambah komentar |
| GET | /tasks/:taskId/comments | daftar komentar tugas |
| PATCH | /comments/:id | ubah komentar |
| DELETE | /comments/:id | hapus komentar |

### Files (metadata)
| Method | URL | Fungsi |
|---|---|---|
| POST | /projects/:projectId/files | simpan metadata file |
| GET | /projects/:projectId/files | daftar metadata file project |
| GET | /files/:id | detail metadata file |
| PATCH | /files/:id | ubah metadata |
| DELETE | /files/:id | hapus metadata |

## Aturan Bisnis
- Satu member hanya bisa masuk satu kali ke project yang sama (409 Conflict jika duplikat).
- Assignee tugas, penulis komentar, dan uploader file harus anggota project terkait (400 Bad Request jika bukan).
- Mengeluarkan anggota dari project otomatis melepas assignee pada tugas-tugasnya di project itu.
- Email member unik (409 Conflict).
- Semua input divalidasi (class-validator); field di luar DTO ditolak.

## Contoh Alur Uji (urutan)

1. `POST /projects` -> `{"name":"Website Kampus","description":"Redesign"}`
2. `POST /members` -> `{"name":"Faizal","email":"faizal@mail.com"}`
3. `POST /projects/1/members` -> `{"memberId":1,"role":"OWNER"}`
4. `GET /projects/1/members`
5. `POST /projects/1/tasks` -> `{"title":"Buat wireframe","priority":"HIGH","dueDate":"2026-12-01T00:00:00.000Z","assigneeId":1}`
6. `PATCH /tasks/1` -> `{"status":"IN_PROGRESS"}`
7. `POST /tasks/1/comments` -> `{"authorId":1,"content":"Mulai dikerjakan"}`
8. `POST /projects/1/files` -> `{"fileName":"wireframe.pdf","mimeType":"application/pdf","size":120400,"uploadedById":1}`
9. `GET /projects/1/files`

## Struktur Folder

```
src/
  entities/          # Project, Member, ProjectMember, Task, Comment, FileMetadata
  projects/          # controller, service, dto, module
  members/
  project-members/
  tasks/
  comments/
  files/
  app.module.ts
  main.ts
```

Ditambahkan oleh evsaL22
