import Promise from "bluebird";


const simpleTemplate = 'import static net.sf.dynamicreports.report.builder.DynamicReports.*; reportBuilder.title(cmp.text("Order"))';
export let data = { results: [
  {persistentId: '123',
   name: 'First',
   active: true,
   template: simpleTemplate},
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
