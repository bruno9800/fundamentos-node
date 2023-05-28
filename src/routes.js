import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';

const database  = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks', req.query);
      return res.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
        const {title, description, ...rest} = req.body;
        if(!title || !description || !!Object.values(rest).length) {
          return res.writeHead(400).end('requisição invalida invalido');
        }

        const task = {
          id: randomUUID(),
          title,
          description,
          created_at: new Date(),
          completed_at: null,
          updated_at: new Date()
        }

        database.insert('tasks', task);

        return res.writeHead(201).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
        const { id } = req.params;
        try {
          database.delete('tasks', id);
        }catch (err) {
          return res.writeHead(404).end(`${err}`);
        } 

        return res.writeHead(204).end();
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
        const { id } = req.params;
        const { title, description, ...rest } = req.body;
        
        if(!title || !description || !!Object.values(rest).length) {
          return res.writeHead(400).end('requisição invalida invalido');
        }


        try {
          database.update('tasks', id, {
            title, 
            description,
            updated_at: new Date()
          });
        }catch(err) {
          return res.writeHead(404).end(`${err}`);
        }

        return res.writeHead(204).end();
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
        const { id } = req.params;

        try {
          database.patch('tasks', id, {
            updated_at: new Date(),
            completed_at: new Date(),
          });

        } catch(err) {
          return res.writeHead(404).end(`${err}`);
        }

        return res.writeHead(204).end();
    }
  },
  

]