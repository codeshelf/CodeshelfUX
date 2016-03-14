
import Promise from "bluebird";

export let data = { results: [
  {persistentId: '123',
   name: 'First',
   active: true,
   template: 'Hi this is first',},
   {persistentId: '456',
    name: 'Second',
    active: true,
    template: 'Hi this is second',},
    {persistentId: '789',
     name: 'Third',
     active: true,
     template: 'Hi this is third',},
]}

export function getTemplates() {
  return Promise.delay(Promise.resolve(data), 150);
}