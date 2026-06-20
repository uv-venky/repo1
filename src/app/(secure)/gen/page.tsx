'use client';

import { CodeGenPage } from 'venky-core/ui';

const modules = [
  {
    value: 'admin',
    label: 'Administration',
  },
];

const subModules = [
  {
    value: 'config',
    label: 'Configuration',
  },
  {
    value: 'monitoring',
    label: 'Monitoring',
  },
];

export default function Page() {
  return <CodeGenPage modules={modules} subModules={subModules} />;
}
