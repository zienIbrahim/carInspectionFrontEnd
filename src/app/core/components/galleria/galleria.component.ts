import { ChangeDetectorRef, Component, Inject, Input, input, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Galleria, GalleriaModule } from 'primeng/galleria';
import { IconDirective } from "@ant-design/icons-angular";

@Component({
  selector: 'app-galleria',
  imports: [ButtonModule,IconDirective, GalleriaModule],
  templateUrl: './galleria.component.html',
  styles: [
    `:host ::ng-deep {
        .custom-galleria {
            &.p-galleria {
                &.fullscreen {
                    display: flex;
                    flex-direction: column;

                    .p-galleria-content {
                        flex-grow: 1;
                        justify-content: center;
                    }
                }

                .p-galleria-content {
                    position: relative;
                }

                .p-galleria-thumbnail-wrapper {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                }

                .p-galleria-thumbnail-items-container {
                    width: 100%;
                }

                .custom-galleria-footer {
                    display: flex;
                    align-items: center;
                    background-color: rgb(24 144 254);
                    color: #ffffff;

                    > button {
                        background-color: transparent;
                        color: #ffffff;
                        border: 0 none;
                        border-radius: 0;
                        margin: .2rem 0;

                        &.fullscreen-button {
                            margin-left: auto;
                        }

                        &:hover {
                            background-color: rgba(255, 255, 255, 0.1);
                        }
                    }
                }

                .title-container {
                    > span {
                        font-size: .9rem;
                        padding-left: .829rem;

                        &.title {
                            font-weight: bold;
                        }
                    }
                }
            }
        }
    }`
  ],
})
export class GalleriaComponent implements OnInit, OnDestroy {
   @Input() images: {src:string,comment?:string}[] | undefined;

  showThumbnails: boolean | undefined;

  fullscreen: boolean = false;

  activeIndex: number = 0;

  onFullScreenListener: any;

  @ViewChild('galleria') galleria: Galleria | undefined;
  constructor(@Inject(PLATFORM_ID) private platformId: any, private cd: ChangeDetectorRef) { }
  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 4
    },
    {
      breakpoint: '575px',
      numVisible: 1
    }

  ];
  ngOnInit() {
    this.bindDocumentListeners();
  }
  onThumbnailButtonClick() {
    this.showThumbnails = !this.showThumbnails;
  }

  toggleFullScreen() {
    if (this.fullscreen) {
      this.closePreviewFullScreen();
    } else {
      this.openPreviewFullScreen();
    }

    this.cd.detach();
  }

  openPreviewFullScreen() {
    let elem = this.galleria?.element.nativeElement.querySelector('.p-galleria');
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem['mozRequestFullScreen']) {
      /* Firefox */
      elem['mozRequestFullScreen']();
    } else if (elem['webkitRequestFullscreen']) {
      /* Chrome, Safari & Opera */
      elem['webkitRequestFullscreen']();
    } else if (elem['msRequestFullscreen']) {
      /* IE/Edge */
      elem['msRequestFullscreen']();
    }
  }

  onFullScreenChange() {
    this.fullscreen = !this.fullscreen;
    this.cd.detectChanges();
    this.cd.reattach();
  }

  closePreviewFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document['mozCancelFullScreen']) {
      document['mozCancelFullScreen']();
    } else if (document['webkitExitFullscreen']) {
      document['webkitExitFullscreen']();
    } else if (document['msExitFullscreen']) {
      document['msExitFullscreen']();
    }
  }

  bindDocumentListeners() {
    this.onFullScreenListener = this.onFullScreenChange.bind(this);
    document.addEventListener('fullscreenchange', this.onFullScreenListener);
    document.addEventListener('mozfullscreenchange', this.onFullScreenListener);
    document.addEventListener('webkitfullscreenchange', this.onFullScreenListener);
    document.addEventListener('msfullscreenchange', this.onFullScreenListener);
  }

  unbindDocumentListeners() {
    document.removeEventListener('fullscreenchange', this.onFullScreenListener);
    document.removeEventListener('mozfullscreenchange', this.onFullScreenListener);
    document.removeEventListener('webkitfullscreenchange', this.onFullScreenListener);
    document.removeEventListener('msfullscreenchange', this.onFullScreenListener);
    this.onFullScreenListener = null;
  }

  ngOnDestroy() {
    this.unbindDocumentListeners();
  }

  galleriaClass() {
    return `custom-galleria ${this.fullscreen ? 'fullscreen' : ''}`;
  }

  fullScreenIcon() {
    return `${this.fullscreen ? 'fullscreen-exit' : 'fullscreen'}`;
  }
}
