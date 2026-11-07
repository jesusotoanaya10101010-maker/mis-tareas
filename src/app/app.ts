import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Tarea {
  id: number;
  texto: string;
  completada: boolean;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly maxPalabras = 60;
  private siguienteId = 1;

  nuevaTarea = signal('');
  tareas = signal<Tarea[]>([]);

  palabras = computed(() => {
    const texto = this.nuevaTarea().trim();
    return texto ? texto.split(/\s+/).length : 0;
  });

  pendientes = computed(
    () => this.tareas().filter((t) => !t.completada).length
  );

  puedeAgregar = computed(
    () => this.palabras() > 0 && this.palabras() <= this.maxPalabras
  );

  agregar() {
    if (!this.puedeAgregar()) return;

    this.tareas.update((lista) => [
      ...lista,
      { id: this.siguienteId++, texto: this.nuevaTarea().trim(), completada: false },
    ]);
    this.nuevaTarea.set('');
  }

  alternar(id: number) {
    this.tareas.update((lista) =>
      lista.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t))
    );
  }

  eliminar(id: number) {
    this.tareas.update((lista) => lista.filter((t) => t.id !== id));
  }
}