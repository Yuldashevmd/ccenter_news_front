import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { MultiBackend, type MultiBackendOptions } from 'react-dnd-multi-backend';
import { TouchTransition } from 'react-dnd-multi-backend';

export const HTML5toTouch = MultiBackend;

export const backendOptions: MultiBackendOptions = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      preview: true,
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      transition: TouchTransition,
      preview: true,
    },
  ],
};
