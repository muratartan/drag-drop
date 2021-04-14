class ProjectInput {
   templateElement: HTMLTemplateElement;
   hostElement: HTMLDivElement;

   constructor() {
      this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
      this.hostElement = document.getElementById('app')! as HTMLDivElement;

      const importNode = document.importNode(this.templateElement.content, true);
   }
}