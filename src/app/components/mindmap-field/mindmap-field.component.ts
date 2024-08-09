import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { Transformer, builtInPlugins } from 'markmap-lib';
import { Markmap } from 'markmap-view';

@Component({
  selector: 'app-mindmap-field',
  standalone: true,
  imports: [],
  templateUrl: './mindmap-field.component.html',
  styleUrl: './mindmap-field.component.css'
})
export class MindmapFieldComponent implements AfterViewInit {
  constructor() {
    this.transformer = new Transformer([...builtInPlugins]);
  }

  markdown: string = '';
  transformer!: Transformer;
  mindmap!: Markmap;

  @ViewChild('svg') svg!: ElementRef<SVGElement>;

  ngAfterViewInit(): void {
    this.mindmap = Markmap.create(this.svg.nativeElement);
  }

  @Input() set code(markdown: string) {
    if (markdown.length > 0) {
      const { root } = this.transformer.transform(markdown);
      this.mindmap.setData(root);
      this.mindmap.fit();

      this.markdown = markdown;
    }
  }
}
