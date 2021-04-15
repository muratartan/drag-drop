//validaton

interface Validatable {
   value: string | number;
   required?: boolean;
   minLength?: number;
   maxLength?: number;
   min?: number;
   max?: number;
}

function Validate(ValidatableInput: Validatable) {
   let isValid = true;
   if (ValidatableInput.required) {
      isValid = isValid && ValidatableInput.value.toString().trim().length !== 0
   }
   if (ValidatableInput.minLength != null && typeof ValidatableInput.value === 'string') {
      isValid = isValid && ValidatableInput.value.length >= ValidatableInput.minLength
   }
   if (ValidatableInput.maxLength != null && typeof ValidatableInput.value === 'string') {
      isValid = isValid && ValidatableInput.value.length <= ValidatableInput.maxLength
   }
   if (ValidatableInput.min != null && ValidatableInput.value === 'number') {
      isValid = isValid && ValidatableInput.min >= ValidatableInput.min
   }
   if (ValidatableInput.max != null && ValidatableInput.value === 'number') {
      isValid = isValid && ValidatableInput.max <= ValidatableInput.max
   }

   return isValid;
}


// autobind decorator

function autobind(
   _: any,
   _2: string,
   descriptor: PropertyDescriptor) {
   const originalMethod = descriptor.value;
   const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      get() {
         const boundFn = originalMethod.bind(this);
         return boundFn;
      }
   };
   return adjDescriptor;
}

// project List Class

class ProjectList {
   templateElement: HTMLTemplateElement;
   hostElement: HTMLDivElement;
   element: HTMLElement;

   constructor(private type: 'active' | 'finished') {
      this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
      this.hostElement = document.getElementById('app')! as HTMLDivElement;

      const importedNode = document.importNode(this.templateElement.content, true);
      this.element = importedNode.firstElementChild as HTMLElement;
      this.element.id = `${this.type}-projects`;
      this.attach();
   }

   private attach() {
      this.hostElement.insertAdjacentElement('beforeend', this.element)
   }
}

// project Input Class

class ProjectInput {
   templateElement: HTMLTemplateElement;
   hostElement: HTMLDivElement;
   element: HTMLFormElement;
   titleInputElement: HTMLInputElement;
   descriptionInputElement: HTMLInputElement;
   peopleInputElement: HTMLInputElement;

   constructor() {
      this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
      this.hostElement = document.getElementById('app')! as HTMLDivElement;

      const importedNode = document.importNode(this.templateElement.content, true);
      this.element = importedNode.firstElementChild as HTMLFormElement;
      this.element.id = 'user-input';

      this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

      this.configure();
      this.attach();
   }

   private gatherUserInput(): [string, string, number] | void {
      const enteredTitle = this.titleInputElement.value;
      const enteredDescription = this.descriptionInputElement.value;
      const enteredPeople = this.peopleInputElement.value;

      const titleValidatable: Validatable = {
         value: enteredTitle,
         required: true,
      };

      const descriptionValidatable: Validatable = {
         value: enteredDescription,
         required: true,
         minLength: 5
      };

      const peopleValidatable: Validatable = {
         value: +enteredPeople,
         required: true,
         min: 1,
         max: 5
      };

      if (
         !Validate(titleValidatable) ||
         !Validate(descriptionValidatable) ||
         !Validate(peopleValidatable)
      ) {
         alert('invalid input, please try again!')
         return;
      } else {
         return [enteredTitle, enteredDescription, +enteredPeople]
      }
   };

   private clearInputs() {
      this.titleInputElement.value = '',
         this.descriptionInputElement.value = '',
         this.peopleInputElement.value = ''
   }

   @autobind
   private submitHandler(event: Event) {
      event.preventDefault();
      const userInput = this.gatherUserInput();
      if (Array.isArray(userInput)) {
         const [title, desc, people] = userInput;
         console.log(title, desc, people);
         this.clearInputs();
      }
   };

   private configure() {
      this.element.addEventListener('submit', this.submitHandler)
   }

   private attach() {
      this.hostElement.insertAdjacentElement('afterbegin', this.element)
   }
};

const prjInput = new ProjectInput();