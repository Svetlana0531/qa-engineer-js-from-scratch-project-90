import { randomUUID } from 'node:crypto';

export const credentials = {
  username: 'login',
  password: 'password',
};

export const validationMessages = {
  required: 'Required',
  invalidEmail: 'Incorrect email format',
};

export const invalidData = {
  password: 'any-password',
  email: 'invalid-email-format',
};

export const seedData = {
  label: { id: 1, name: 'bug' },
  status: { id: 1, name: 'Draft', slug: 'draft' },
  user: { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@google.com' },
  movableTask: { title: 'Task 11', sourceStatus: 'Draft', targetStatus: 'To Review' },
};

export const statusNames = ['Draft', 'To Review', 'To Be Fixed', 'To Publish', 'Published'];

export const createTestData = () => {
  const suffix = randomUUID();
  const task = (prefix, content) => ({
    title: `${prefix}_${suffix}`,
    content,
    assignee: seedData.user.email,
    status: seedData.status.name,
  });

  return {
    label: { name: `Label_${suffix}`, updatedName: `UpdatedLabel_${suffix}` },
    status: {
      name: `Status_${suffix}`,
      slug: `slug_${suffix}`,
      updatedName: `UpdatedStatus_${suffix}`,
    },
    user: {
      firstName: 'John',
      lastName: 'Doe',
      email: `test_${suffix}@hexlet.io`,
      updated: { firstName: 'Alex', email: `updated_${suffix}@hexlet.io` },
    },
    tasks: {
      create: task('TaskTitle', 'Automated testing task content'),
      filter: task('FilterTask', 'Task for status filtering'),
      edit: task('EditTask', 'Task before editing'),
      updated: task('UpdatedTitle', 'Updated task description'),
      delete: task('DeleteTask', 'Task for deletion'),
    },
  };
};
