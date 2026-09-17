<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fabric } from 'fabric';
  import {
    Square,
    Columns,
    LayoutList,
    LayoutPanelTop,
    Layers,
    Download,
    Copy,
    RefreshCw,
    Upload,
    Bold,
    Italic,
    Type,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Search,
    Plus,
    Trash2,
    Dices,
    Sparkles,
    Sticker,
    ArrowUp,
    ArrowDown,
    X,
    Check
  } from '@lucide/svelte';
  import { allImageTemplates, getFallbackSvgUrl, fetchRedditMemes } from './lib/templatesData';
  import type { MemeTemplate } from './lib/templatesData';

  // Canvas refs and state
  let canvas: fabric.Canvas;
  let isCanvasLoaded = $state(false);
  let canvasEl: HTMLCanvasElement;
  let canvasFrameEl = $state<HTMLDivElement | null>(null);
  let canvasPanelEl = $state<HTMLElement | null>(null);
  let baseCanvasWidth = 500;
  let baseCanvasHeight = 500;

  let {
    currentMode = 'dark',
    initialTemplate = null
  }: {
    currentMode?: 'dark' | 'light';
    initialTemplate?: MemeTemplate | null;
  } = $props();

  let canvasBgColor = $derived(currentMode === 'light' ? '#ffffff' : '#000000');
  let dividerColor = $derived(currentMode === 'light' ? '#000000' : '#ffffff');
  let handleColor = '#87a665';
  let handleStrokeColor = '#ffffff';

  let activeTab = $state<'templates' | 'text' | 'dual' | 'stickers'>('templates');
  let isRandomizing = $state(false);
  let layoutMode = $state<'single' | 'split-h' | 'split-v' | 'header' | 'collage'>('single');
  let activeSlot = $state<1 | 2>(1);

  let slot1 = $state<{ url: string; name: string }>({ url: '/img/girl-running.png', name: 'Girl Running' });
  let slot2 = $state<{ url: string; name: string }>({ url: '/img/doge.png', name: 'Doge' });

  // Text state
  let topTextInput = $state('');
  let bottomTextInput = $state('');
  let customTextInput = $state('');
  let isTextSelected = $state(false);
  let isObjectSelected = $state(false);
  let isImageSelected = $state(false);

  // Text formatting
  let textColor = $state('#ffffff');
  let strokeColor = $state('#000000');
  let strokeWidth = $state(3);
  let fontSize = $state(44);
  let fontFamily = $state('Anton');
  let isBold = $state(false);
  let isItalic = $state(false);
  let isAllCaps = $state(true);
  let textAlign = $state<'left' | 'center' | 'right'>('center');
  let textBgColor = $state('transparent');

  const proFontFamilies = [
    { label: 'Anton (Classic Meme)', value: 'Anton' },
    { label: 'Impact (Heavy Sans)', value: 'Impact' },
    { label: 'Bebas Neue (Tall Bold)', value: 'Bebas Neue' },
    { label: 'Montserrat (Viral Bold)', value: 'Montserrat' },
    { label: 'Outfit (Modern Clean)', value: 'Outfit' },
    { label: 'Arial (Standard Sans)', value: 'Arial' },
    { label: 'Comic Sans MS (Dogelore)', value: 'Comic Sans MS' },
    { label: 'JetBrains Mono (Tech Code)', value: 'JetBrains Mono' }
  ];

  const quickColors = [
    { name: 'White', hex: '#ffffff' },
    { name: 'Black', hex: '#000000' },
    { name: 'Yellow', hex: '#ffe600' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Olive', hex: '#87a665' },
    { name: 'Cyan', hex: '#00f2fe' }
  ];

  // All 1,330+ real image meme templates
  let allTemplates = $state<MemeTemplate[]>([...allImageTemplates]);
  let searchQuery = $state('');
  let visibleCount = $state(60);
  let isLoadingMore = $state(false);
  let copyFeedback = $state(false);

  const stickers = [
    { name: 'Doge', src: '/img/doge.png' },
    { name: 'Popcat', src: '/img/popcat.gif' },
    { name: 'Knuckles', src: '/img/knuckles.png' },
    { name: 'Polite Cat', src: '/img/polite-cat.png' },
    { name: 'Pikachu', src: '/img/surprised-pikachu.png' }
  ];

  let filteredTemplates = $derived(
    allTemplates
      .filter(t => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, visibleCount)
  );

  function randomizeTemplate() {
    if (allTemplates.length === 0) return;
    isRandomizing = true;
    const rand = allTemplates[Math.floor(Math.random() * allTemplates.length)];
    selectTemplate(rand);
    setTimeout(() => { isRandomizing = false; }, 350);
  }

  $effect(() => {
    if (initialTemplate && isCanvasLoaded) {
      selectTemplate(initialTemplate);
    }
  });

  onMount(() => {
    isCanvasLoaded = true;
    canvas = new fabric.Canvas(canvasEl, {
      preserveObjectStacking: true,
      backgroundColor: canvasBgColor,
      width: 500,
      height: 500
    });

    canvas.on('selection:created', handleSelectionChange);
    canvas.on('selection:updated', handleSelectionChange);
    canvas.on('selection:cleared', () => {
      isTextSelected = false;
      isObjectSelected = false;
      isImageSelected = false;
    });

    $effect(() => {
      if (canvas) {
        canvas.backgroundColor = canvasBgColor;
        canvas.getObjects().forEach(obj => {
          if ((obj as any).isPanel && (obj as any).type === 'rect') {
            obj.set('fill', dividerColor);
          }
          if ((obj as any).isMemeElement) {
            obj.set({ cornerColor: handleColor, borderColor: handleColor, cornerStrokeColor: handleStrokeColor });
          }
        });
        canvas.requestRenderAll();
      }
    });

    if (initialTemplate) {
      slot1 = { url: initialTemplate.url, name: initialTemplate.name };
    }

    renderLayout();
    addClassicTopText();
    addClassicBottomText();

    // Start with clean canvas without active selection bounding box
    setTimeout(() => {
      if (canvas) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        isTextSelected = false;
        isObjectSelected = false;
        isImageSelected = false;
      }
    }, 100);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        updateResponsiveCanvasSize();
      });
      if (canvasPanelEl) ro.observe(canvasPanelEl);
      if (canvasFrameEl) ro.observe(canvasFrameEl);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', updateResponsiveCanvasSize);
    window.addEventListener('orientationchange', updateResponsiveCanvasSize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    requestAnimationFrame(() => {
      updateResponsiveCanvasSize();
    });
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('resize', updateResponsiveCanvasSize);
    window.removeEventListener('orientationchange', updateResponsiveCanvasSize);
    window.removeEventListener('scroll', handleScroll);
    if (canvas) canvas.dispose();
  });

  function handleScroll() {
    if (canvas) {
      canvas.calcOffset();
    }
  }

  function updateResponsiveCanvasSize() {
    if (!canvas || !canvasFrameEl) return;
    const isMobile = window.innerWidth <= 900;
    let targetWidth: number;
    let targetHeight: number;

    if (isMobile) {
      const maxW = Math.max(260, Math.min(window.innerWidth - 20, 520));
      const maxH = Math.max(260, Math.round(window.innerHeight * 0.46));
      const scale = Math.min(1, maxW / baseCanvasWidth, maxH / baseCanvasHeight);
      targetWidth = Math.round(baseCanvasWidth * scale);
      targetHeight = Math.round(baseCanvasHeight * scale);
    } else {
      const maxW = canvasPanelEl ? Math.max(280, canvasPanelEl.clientWidth - 32) : 560;
      const maxH = Math.max(280, window.innerHeight - 150);
      const scale = Math.min(1, maxW / baseCanvasWidth, maxH / baseCanvasHeight);
      targetWidth = Math.round(baseCanvasWidth * scale);
      targetHeight = Math.round(baseCanvasHeight * scale);
    }

    canvas.setDimensions({
      width: `${targetWidth}px`,
      height: `${targetHeight}px`
    }, { cssOnly: true });

    canvas.calcOffset();
    canvas.requestRenderAll();
  }

  function loadImageSafely(url: string, fallbackName: string, cb: (img: fabric.Image) => void) {
    fabric.Image.fromURL(url, (img) => {
      if (!img) {
        fabric.Image.fromURL(getFallbackSvgUrl(fallbackName), (fbImg) => {
          if (fbImg) cb(fbImg);
        });
        return;
      }
      cb(img);
    }, { crossOrigin: 'anonymous' });
  }

  function renderLayout() {
    if (!canvas) return;
    const userElements: fabric.Object[] = [];
    canvas.getObjects().forEach(obj => {
      if ((obj as any).isMemeElement) userElements.push(obj);
    });
    canvas.clear();
    canvas.backgroundColor = canvasBgColor;

    if (layoutMode === 'single') {
      baseCanvasWidth = 500;
      baseCanvasHeight = 500;
      canvas.setWidth(500);
      canvas.setHeight(500);
      if (slot1.url) {
        loadImageSafely(slot1.url, slot1.name, (img) => {
          const scale = Math.min(500 / (img.width || 500), 500 / (img.height || 500));
          img.set({ left: 250, top: 250, originX: 'center', originY: 'center', scaleX: scale, scaleY: scale, selectable: false, evented: false });
          (img as any).isPanel = true;
          canvas.add(img);
          canvas.sendToBack(img);
          restoreUserElements(userElements);
        });
      } else {
        restoreUserElements(userElements);
      }
    } else if (layoutMode === 'header') {
      baseCanvasWidth = 500;
      baseCanvasHeight = 560;
      canvas.setWidth(500);
      canvas.setHeight(560);
      const headerH = 110;
      const headerBg = new fabric.Rect({
        left: 0,
        top: 0,
        width: 500,
        height: headerH,
        fill: currentMode === 'light' ? '#ffffff' : '#18181b',
        selectable: false,
        evented: false
      });
      (headerBg as any).isPanel = true;
      canvas.add(headerBg);
      const sepLine = new fabric.Rect({
        left: 0,
        top: headerH,
        width: 500,
        height: 2,
        fill: dividerColor,
        selectable: false,
        evented: false
      });
      (sepLine as any).isPanel = true;
      canvas.add(sepLine);

      if (slot1.url) {
        loadImageSafely(slot1.url, slot1.name, (img) => {
          const scale = Math.min(500 / (img.width || 500), 448 / (img.height || 448));
          img.set({
            left: 250,
            top: headerH + 224,
            originX: 'center',
            originY: 'center',
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            evented: false
          });
          (img as any).isPanel = true;
          canvas.add(img);
          canvas.sendToBack(img);
          canvas.sendToBack(sepLine);
          canvas.sendToBack(headerBg);
          const hasCaption = userElements.some(el => (el as any).isHeaderCaption);
          if (!hasCaption && userElements.length === 0) addHeaderCaption();
          else restoreUserElements(userElements);
        });
      } else {
        restoreUserElements(userElements);
      }
    } else if (layoutMode === 'split-h') {
      baseCanvasWidth = 600;
      baseCanvasHeight = 400;
      canvas.setWidth(600);
      canvas.setHeight(400);
      const divider = new fabric.Rect({
        left: 298,
        top: 0,
        width: 4,
        height: 400,
        fill: dividerColor,
        selectable: false,
        evented: false
      });
      (divider as any).isPanel = true;
      canvas.add(divider);
      let pending = 2;
      const onDone = () => { pending--; if (pending <= 0) restoreUserElements(userElements); };

      if (slot1.url) {
        loadImageSafely(slot1.url, slot1.name, (img) => {
          const scale = Math.min(296 / (img.width || 296), 400 / (img.height || 400));
          img.set({ left: 148, top: 200, originX: 'center', originY: 'center', scaleX: scale, scaleY: scale, selectable: false, evented: false });
          (img as any).isPanel = true;
          canvas.add(img);
          canvas.sendToBack(img);
          onDone();
        });
      } else { onDone(); }

      if (slot2.url) {
        loadImageSafely(slot2.url, slot2.name, (img) => {
          const scale = Math.min(296 / (img.width || 296), 400 / (img.height || 400));
          img.set({ left: 452, top: 200, originX: 'center', originY: 'center', scaleX: scale, scaleY: scale, selectable: false, evented: false });
          (img as any).isPanel = true;
          canvas.add(img);
          canvas.sendToBack(img);
          onDone();
        });
      } else { onDone(); }
    } else if (layoutMode === 'split-v') {
      baseCanvasWidth = 420;
      baseCanvasHeight = 560;
      canvas.setWidth(420);
      canvas.setHeight(560);
      const divider = new fabric.Rect({
        left: 0,
        top: 278,
        width: 420,
        height: 4,
        fill: dividerColor,
        selectable: false,
        evented: false
      });
      (divider as any).isPanel = true;
      canvas.add(divider);
      let pending = 2;
      const onDone = () => { pending--; if (pending <= 0) restoreUserElements(userElements); };

      if (slot1.url) {
        loadImageSafely(slot1.url, slot1.name, (img) => {
          const scale = Math.min(420 / (img.width || 420), 276 / (img.height || 276));
          img.set({ left: 210, top: 138, originX: 'center', originY: 'center', scaleX: scale, scaleY: scale, selectable: false, evented: false });
          (img as any).isPanel = true;
          canvas.add(img);
          canvas.sendToBack(img);
          onDone();
        });
      } else { onDone(); }

      if (slot2.url) {
        loadImageSafely(slot2.url, slot2.name, (img) => {
          const scale = Math.min(420 / (img.width || 420), 276 / (img.height || 276));
          img.set({ left: 210, top: 422, originX: 'center', originY: 'center', scaleX: scale, scaleY: scale, selectable: false, evented: false });
          (img as any).isPanel = true;
          canvas.add(img);
          canvas.sendToBack(img);
          onDone();
        });
      } else { onDone(); }
    } else {
      baseCanvasWidth = 500;
      baseCanvasHeight = 500;
      canvas.setWidth(500);
      canvas.setHeight(500);
      restoreUserElements(userElements);
    }
    updateResponsiveCanvasSize();
  }

  function restoreUserElements(elements: fabric.Object[]) {
    elements.forEach(el => {
      canvas.add(el);
      canvas.bringToFront(el);
    });
    canvas.requestRenderAll();
    updateResponsiveCanvasSize();
  }

  function setLayout(mode: typeof layoutMode) {
    layoutMode = mode;
    renderLayout();
  }

  function swapPictures() {
    const t = { ...slot1 };
    slot1 = { ...slot2 };
    slot2 = t;
    renderLayout();
  }

  function clearSlot(n: 1 | 2) {
    if (n === 1) slot1 = { url: '', name: 'Empty' };
    else slot2 = { url: '', name: 'Empty' };
    renderLayout();
  }

  function selectTemplate(t: { url: string; name: string }) {
    if (layoutMode === 'collage') {
      addFloatingImage(t.url);
      return;
    }
    if (activeSlot === 1) {
      slot1 = { url: t.url, name: t.name };
    } else {
      slot2 = { url: t.url, name: t.name };
    }
    renderLayout();
  }

  function handleSlotUpload(e: Event, slotNum: 1 | 2) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => {
        const url = f.target?.result as string;
        if (slotNum === 1) slot1 = { url, name: file.name };
        else slot2 = { url, name: file.name };
        renderLayout();
      };
      reader.readAsDataURL(file);
    }
    (e.target as HTMLInputElement).value = '';
  }

  function addFloatingImage(src: string) {
    if (!canvas) return;
    fabric.Image.fromURL(src, (img) => {
      if (!img) return;
      const scale = Math.min(canvas.getWidth() / (img.width || 500), canvas.getHeight() / (img.height || 500)) * 0.45;
      img.set({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
        cornerColor: handleColor,
        borderColor: handleColor,
        cornerStrokeColor: handleStrokeColor,
        cornerSize: 10,
        transparentCorners: false
      });
      (img as any).isMemeElement = true;
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.bringToFront(img);
      canvas.requestRenderAll();
    }, { crossOrigin: 'anonymous' });
  }

  function handleFloatingUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => addFloatingImage(f.target?.result as string);
      reader.readAsDataURL(file);
    }
    (e.target as HTMLInputElement).value = '';
  }

  function handleSelectionChange() {
    const active = canvas.getActiveObject();
    if (!active) {
      isTextSelected = false;
      isObjectSelected = false;
      isImageSelected = false;
      return;
    }
    isObjectSelected = true;
    isImageSelected = active.type === 'image';
    if (active.type === 'textbox') {
      isTextSelected = true;
      const t = active as fabric.Textbox;
      textColor = (t.fill as string) || '#ffffff';
      strokeColor = (t.stroke as string) || '#000000';
      strokeWidth = t.strokeWidth || 3;
      fontSize = t.fontSize || 44;
      fontFamily = t.fontFamily || 'Anton';
      isBold = t.fontWeight === 'bold';
      isItalic = t.fontStyle === 'italic';
      textAlign = (t.textAlign as typeof textAlign) || 'center';
      textBgColor = (t.textBackgroundColor as string) || 'transparent';
    } else {
      isTextSelected = false;
    }
  }

  function updateTextProp(prop: string, val: any) {
    const active = canvas.getActiveObject();
    if (active && active.type === 'textbox') {
      active.set(prop as any, val);
      canvas.requestRenderAll();
    }
  }

  function updateFontFamily(f: string) {
    fontFamily = f;
    updateTextProp('fontFamily', f);
  }

  function applyTextColor(hex: string) {
    textColor = hex;
    updateTextProp('fill', hex);
  }

  function applyTextBackground(c: string) {
    textBgColor = c;
    updateTextProp('textBackgroundColor', c === 'transparent' ? '' : c);
  }

  function toggleBold() {
    isBold = !isBold;
    updateTextProp('fontWeight', isBold ? 'bold' : 'normal');
  }

  function toggleItalic() {
    isItalic = !isItalic;
    updateTextProp('fontStyle', isItalic ? 'italic' : 'normal');
  }

  function toggleAllCaps() {
    const a = canvas.getActiveObject() as fabric.Textbox;
    if (a && a.type === 'textbox' && a.text) {
      isAllCaps = !isAllCaps;
      a.set('text', isAllCaps ? a.text.toUpperCase() : a.text.toLowerCase());
      canvas.requestRenderAll();
    }
  }

  function setTextAlign(a: typeof textAlign) {
    textAlign = a;
    updateTextProp('textAlign', a);
  }

  function handleImageError(event: Event, t: MemeTemplate) {
    const target = event.target as HTMLImageElement;
    if (target) target.src = getFallbackSvgUrl(t.name);
  }

  function addHeaderCaption() {
    if (!canvas) return;
    const text = new fabric.Textbox('When you finally deploy and it works on the first try', {
      left: canvas.getWidth() / 2,
      top: 55,
      originX: 'center',
      originY: 'center',
      fontSize: 22,
      fill: currentMode === 'light' ? '#09090b' : '#f4f4f5',
      stroke: '',
      strokeWidth: 0,
      fontFamily: 'Outfit',
      fontWeight: 'bold',
      textAlign: 'center',
      width: canvas.getWidth() - 40,
      cornerColor: handleColor,
      borderColor: handleColor,
      cornerStrokeColor: handleStrokeColor,
      cornerSize: 10,
      transparentCorners: false
    });
    (text as any).isMemeElement = true;
    (text as any).isHeaderCaption = true;
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.bringToFront(text);
    canvas.requestRenderAll();
  }

  function addClassicTopText() {
    if (!canvas) return;
    const text = new fabric.Textbox(topTextInput || 'TOP TEXT', {
      left: canvas.getWidth() / 2,
      top: 45,
      originX: 'center',
      originY: 'center',
      fontSize: 44,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 3,
      paintFirst: 'stroke',
      fontFamily: 'Anton',
      textAlign: 'center',
      width: canvas.getWidth() - 30,
      cornerColor: handleColor,
      borderColor: handleColor,
      cornerStrokeColor: handleStrokeColor,
      cornerSize: 10,
      transparentCorners: false
    });
    (text as any).isMemeElement = true;
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.bringToFront(text);
    canvas.requestRenderAll();
    topTextInput = '';
  }

  function addClassicBottomText() {
    if (!canvas) return;
    const text = new fabric.Textbox(bottomTextInput || 'BOTTOM TEXT', {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() - 50,
      originX: 'center',
      originY: 'center',
      fontSize: 44,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 3,
      paintFirst: 'stroke',
      fontFamily: 'Anton',
      textAlign: 'center',
      width: canvas.getWidth() - 30,
      cornerColor: handleColor,
      borderColor: handleColor,
      cornerStrokeColor: handleStrokeColor,
      cornerSize: 10,
      transparentCorners: false
    });
    (text as any).isMemeElement = true;
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.bringToFront(text);
    canvas.requestRenderAll();
    bottomTextInput = '';
  }

  function addCustomText() {
    if (!canvas) return;
    const text = new fabric.Textbox(customTextInput || 'Your Text Here', {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      originX: 'center',
      originY: 'center',
      fontSize: 40,
      fill: textColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      paintFirst: 'stroke',
      fontFamily: fontFamily,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textAlign: textAlign,
      width: 360,
      cornerColor: handleColor,
      borderColor: handleColor,
      cornerStrokeColor: handleStrokeColor,
      cornerSize: 10,
      transparentCorners: false
    });
    (text as any).isMemeElement = true;
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.bringToFront(text);
    canvas.requestRenderAll();
    customTextInput = '';
  }

  function deleteSelected() {
    const active = canvas.getActiveObjects();
    if (active.length) {
      active.forEach(obj => {
        if (!(obj as any).isPanel) canvas.remove(obj);
      });
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
  }

  function duplicateSelected() {
    const active = canvas.getActiveObject();
    if (active && !(active as any).isPanel) {
      active.clone((cloned: fabric.Object) => {
        cloned.set({
          left: (cloned.left || 0) + 15,
          top: (cloned.top || 0) + 15,
          cornerColor: handleColor,
          borderColor: handleColor,
          cornerStrokeColor: handleStrokeColor,
          cornerSize: 10,
          transparentCorners: false
        });
        (cloned as any).isMemeElement = true;
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.bringToFront(cloned);
        canvas.requestRenderAll();
      });
    }
  }

  function flipSelected() {
    const a = canvas.getActiveObject();
    if (a && !(a as any).isPanel) {
      a.set('flipX', !a.flipX);
      canvas.requestRenderAll();
    }
  }

  function bringForward() {
    const a = canvas.getActiveObject();
    if (a && !(a as any).isPanel) {
      canvas.bringToFront(a);
      canvas.requestRenderAll();
    }
  }

  function sendBackward() {
    const a = canvas.getActiveObject();
    if (a && !(a as any).isPanel) {
      canvas.sendBackwards(a);
      canvas.getObjects().filter(o => (o as any).isPanel).forEach(p => canvas.sendToBack(p));
      canvas.requestRenderAll();
    }
  }

  function clearAllTextAndStickers() {
    canvas.getObjects().forEach(obj => {
      if ((obj as any).isMemeElement) canvas.remove(obj);
    });
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }

  function clearAllStickers() {
    if (!canvas) return;
    canvas.getObjects().forEach(obj => {
      if ((obj as any).isMemeElement && obj.type === 'image') canvas.remove(obj);
    });
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }

  function handleKeyDown(e: KeyboardEvent) {
    const activeEl = document.activeElement;
    const isEditing = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || (activeEl as HTMLElement).isContentEditable);
    const isFabricEditing = canvas?.getActiveObject() && (canvas.getActiveObject() as any).isEditing;
    if (isEditing || isFabricEditing) return;

    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (isObjectSelected) {
        e.preventDefault();
        deleteSelected();
      }
    } else if (e.key === 'Escape') {
      if (canvas && isObjectSelected) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
      if (isObjectSelected) {
        e.preventDefault();
        duplicateSelected();
      }
    }
  }

  function exportMeme() {
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    const dataURL = canvas.toDataURL({ format: 'png', quality: 1.0 });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `meme-${Date.now()}.png`;
    link.click();
  }

  async function copyToClipboard() {
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    canvas.getElement().toBlob(async (blob) => {
      if (blob) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          copyFeedback = true;
          setTimeout(() => (copyFeedback = false), 2200);
        } catch (err) {
          console.warn('Clipboard write failed:', err);
        }
      }
    });
  }

  async function loadMoreTemplates() {
    isLoadingMore = true;
    try {
      const more = await fetchRedditMemes(50, 'MemeTemplatesOfficial');
      const existingUrls = new Set(allTemplates.map(t => t.url));
      const newMemes = more.filter(t => !existingUrls.has(t.url));
      if (newMemes.length > 0) allTemplates = [...allTemplates, ...newMemes];
    } catch (e) {
      console.error(e);
    }
    visibleCount += 60;
    isLoadingMore = false;
  }
</script>

<div class="studio-viewport">
  <div class="studio-layout">
    <!-- Center Canvas Area -->
    <section class="canvas-panel" bind:this={canvasPanelEl}>
      <!-- Context Notification Bar -->
      <div class="ctx-bar" class:ctx-active={isObjectSelected}>
        {#if isObjectSelected}
          <div class="ctx-left">
            <span class="ctx-badge">
              {#if isTextSelected}<Type size={11} /><span>Text</span>
              {:else if isImageSelected}<Sticker size={11} /><span>Image</span>
              {:else}<Layers size={11} /><span>Layer</span>{/if}
            </span>
            <button type="button" class="ctx-btn danger" onclick={deleteSelected} title="Delete"><Trash2 size={11} /> Del</button>
            <button type="button" class="ctx-btn" onclick={duplicateSelected} title="Duplicate"><Copy size={11} /> Dup</button>
            <button type="button" class="ctx-btn icon" onclick={bringForward} title="Forward"><ArrowUp size={11} /></button>
            <button type="button" class="ctx-btn icon" onclick={sendBackward} title="Backward"><ArrowDown size={11} /></button>
            {#if isImageSelected}
              <button type="button" class="ctx-btn" onclick={flipSelected} title="Flip"><RefreshCw size={11} /> Flip</button>
            {/if}
          </div>
          <button type="button" class="ctx-x" onclick={() => { canvas.discardActiveObject(); canvas.requestRenderAll(); }} title="Deselect (Esc)"><X size={11} /></button>
        {:else}
          <span class="ctx-info">Click to edit • Del = delete • Esc = deselect</span>
        {/if}
      </div>

      <!-- Canvas Frame -->
      <div class="canvas-frame" bind:this={canvasFrameEl}>
        <canvas bind:this={canvasEl}></canvas>
      </div>

      <!-- Floating Toolbar -->
      {#if isCanvasLoaded}
        <div class="toolbar">
          <button type="button" class="tb" class:active={layoutMode === 'single'} onclick={() => setLayout('single')} title="1 Picture Canvas"><Square size={14} /></button>
          <button type="button" class="tb" class:active={layoutMode === 'header'} onclick={() => setLayout('header')} title="Header Caption Meme"><LayoutPanelTop size={14} /></button>
          <button type="button" class="tb" class:active={layoutMode === 'split-h'} onclick={() => setLayout('split-h')} title="Side by Side (2 Pics)"><Columns size={14} /></button>
          <button type="button" class="tb" class:active={layoutMode === 'split-v'} onclick={() => setLayout('split-v')} title="Top & Bottom (2 Pics)"><LayoutList size={14} /></button>
          <button type="button" class="tb" class:active={layoutMode === 'collage'} onclick={() => setLayout('collage')} title="Freeform Collage"><Layers size={14} /></button>
          <div class="tb-sep"></div>
          <button type="button" class="tb dice" class:spin={isRandomizing} onclick={randomizeTemplate} title="Surprise Me (Random Meme)"><Dices size={14} /></button>
          <div class="tb-sep"></div>
          <button type="button" class="tb" onclick={copyToClipboard} title="Copy Meme to Clipboard">
            {#if copyFeedback}<Check size={14} color="#87a665" strokeWidth={3} />{:else}<Copy size={14} />{/if}
          </button>
          <button type="button" class="tb primary" onclick={exportMeme} title="Export High-Res PNG"><Download size={14} /></button>
        </div>
      {/if}
    </section>

    <!-- Right Controls Sidebar -->
    <aside class="sidebar-panel">
      <div class="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'templates'}
          class="tab"
          class:on={activeTab === 'templates'}
          onclick={() => (activeTab = 'templates')}
        >
          <Sparkles size={13} />
          <span>Templates</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'text'}
          class="tab"
          class:on={activeTab === 'text'}
          onclick={() => (activeTab = 'text')}
        >
          <Type size={13} />
          <span>Captions</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'dual'}
          class="tab"
          class:on={activeTab === 'dual'}
          onclick={() => (activeTab = 'dual')}
        >
          <Columns size={13} />
          <span>2-Pictures</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'stickers'}
          class="tab"
          class:on={activeTab === 'stickers'}
          onclick={() => (activeTab = 'stickers')}
        >
          <Sticker size={13} />
          <span>Stickers</span>
        </button>
      </div>

      <div class="panel-content">
        <!-- 1. TEMPLATES -->
        {#if activeTab === 'templates'}
          <button type="button" class="action-btn" onclick={randomizeTemplate}>
            <Dices size={13} class={isRandomizing ? 'spin' : ''} />
            <span>Surprise Me (Random Template)</span>
          </button>

          <div class="search-box">
            <Search size={12} class="search-icon" />
            <input
              type="text"
              class="search-input"
              placeholder="Search {allTemplates.length} real memes..."
              bind:value={searchQuery}
            />
          </div>

          <div class="templates-grid">
            {#each filteredTemplates as t}
              <button
                type="button"
                class="tpl-card"
                onclick={() => selectTemplate(t)}
                title={t.name}
              >
                <img src={t.url} alt="" loading="lazy" onerror={(e) => handleImageError(e, t)} />
                <span class="tpl-title">{t.name}</span>
              </button>
            {/each}
          </div>

          <button type="button" class="load-more-btn" onclick={loadMoreTemplates} disabled={isLoadingMore}>
            {#if isLoadingMore}
              <RefreshCw size={11} class="spin" />
              <span>Loading more...</span>
            {:else}
              <Plus size={11} />
              <span>Load More Memes</span>
            {/if}
          </button>

        <!-- 2. CAPTIONS -->
        {:else if activeTab === 'text'}
          <span class="sec-label">Add Caption Layers</span>
          <div class="input-row">
            <input
              type="text"
              class="field-input"
              placeholder="TOP TEXT..."
              bind:value={topTextInput}
              onkeydown={(e) => e.key === 'Enter' && addClassicTopText()}
            />
            <button type="button" class="add-btn" onclick={addClassicTopText} title="Add Top Caption"><Plus size={14} /></button>
          </div>

          <div class="input-row">
            <input
              type="text"
              class="field-input"
              placeholder="BOTTOM TEXT..."
              bind:value={bottomTextInput}
              onkeydown={(e) => e.key === 'Enter' && addClassicBottomText()}
            />
            <button type="button" class="add-btn" onclick={addClassicBottomText} title="Add Bottom Caption"><Plus size={14} /></button>
          </div>

          <div class="input-row">
            <input
              type="text"
              class="field-input"
              placeholder="Custom caption..."
              bind:value={customTextInput}
              onkeydown={(e) => e.key === 'Enter' && addCustomText()}
            />
            <button type="button" class="add-btn primary-add" onclick={addCustomText} title="Add Custom Caption"><Plus size={14} /></button>
          </div>

          <button type="button" class="header-cap-btn" onclick={addHeaderCaption}>
            <LayoutPanelTop size={12} />
            <span>+ Top Header Caption</span>
          </button>

          <!-- Typography Style Card -->
          <div class="format-card">
            <span class="sec-label">Typography & Style</span>

            <select
              class="font-select"
              bind:value={fontFamily}
              onchange={(e) => updateFontFamily((e.target as HTMLSelectElement).value)}
            >
              {#each proFontFamilies as f}
                <option value={f.value}>{f.label}</option>
              {/each}
            </select>

            <div class="fmt-buttons">
              <button type="button" class="fmt-btn" class:on={isBold} onclick={toggleBold} title="Bold"><Bold size={12} /></button>
              <button type="button" class="fmt-btn" class:on={isItalic} onclick={toggleItalic} title="Italic"><Italic size={12} /></button>
              <button type="button" class="fmt-btn" class:on={isAllCaps} onclick={toggleAllCaps} title="ALL CAPS"><Type size={12} /></button>
              <button type="button" class="fmt-btn" class:on={textAlign === 'left'} onclick={() => setTextAlign('left')} title="Left"><AlignLeft size={12} /></button>
              <button type="button" class="fmt-btn" class:on={textAlign === 'center'} onclick={() => setTextAlign('center')} title="Center"><AlignCenter size={12} /></button>
              <button type="button" class="fmt-btn" class:on={textAlign === 'right'} onclick={() => setTextAlign('right')} title="Right"><AlignRight size={12} /></button>
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>Font Size</span>
                <strong>{fontSize}px</strong>
              </div>
              <input
                type="range"
                min="16"
                max="84"
                step="2"
                bind:value={fontSize}
                oninput={(e) => updateTextProp('fontSize', parseInt((e.target as HTMLInputElement).value))}
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>Outline Stroke</span>
                <strong>{strokeWidth}px</strong>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                bind:value={strokeWidth}
                oninput={(e) => updateTextProp('strokeWidth', parseFloat((e.target as HTMLInputElement).value))}
              />
            </div>

            <div class="swatches-row">
              <span class="sub-label">Color</span>
              <div class="swatches">
                {#each quickColors as c}
                  <button
                    type="button"
                    class="swatch"
                    style="background:{c.hex}"
                    class:selected={textColor.toLowerCase() === c.hex}
                    onclick={() => applyTextColor(c.hex)}
                    title={c.name}
                  >
                    {#if textColor.toLowerCase() === c.hex}
                      <Check size={9} color={c.hex === '#ffffff' || c.hex === '#ffe600' ? '#000' : '#fff'} strokeWidth={3} />
                    {/if}
                  </button>
                {/each}
              </div>
            </div>

            <div class="bg-row">
              <span class="sub-label">Background</span>
              <div class="bg-pills">
                <button type="button" class="bg-pill" class:on={textBgColor === 'transparent'} onclick={() => applyTextBackground('transparent')}>None</button>
                <button type="button" class="bg-pill" class:on={textBgColor === '#000000'} onclick={() => applyTextBackground('#000000')}>Black</button>
                <button type="button" class="bg-pill" class:on={textBgColor === '#ffffff'} onclick={() => applyTextBackground('#ffffff')}>White</button>
                <button type="button" class="bg-pill" class:on={textBgColor === '#87a665'} onclick={() => applyTextBackground('#87a665')}>Olive</button>
              </div>
            </div>

            <div class="picker-row">
              <label class="color-picker-box">
                <span>Custom Fill</span>
                <input type="color" bind:value={textColor} oninput={(e) => updateTextProp('fill', (e.target as HTMLInputElement).value)} />
              </label>
              <label class="color-picker-box">
                <span>Custom Stroke</span>
                <input type="color" bind:value={strokeColor} oninput={(e) => updateTextProp('stroke', (e.target as HTMLInputElement).value)} />
              </label>
            </div>

            <div class="actions-row">
              <button type="button" class="del-btn" onclick={deleteSelected} title="Delete Selected">
                <Trash2 size={11} />
                <span>Delete</span>
              </button>
              <button type="button" class="reset-btn" onclick={clearAllTextAndStickers} title="Reset Text">
                <RefreshCw size={11} />
                <span>Reset All</span>
              </button>
            </div>
          </div>

        <!-- 3. DUAL PICTURES -->
        {:else if activeTab === 'dual'}
          <span class="sec-label">2 Pictures Layout Slots</span>
          <div class="slots-container">
            <div class="slot-box" class:slot-active={activeSlot === 1}>
              <button type="button" class="slot-header-btn" onclick={() => (activeSlot = 1)}>
                <span class="slot-tag">Slot 1</span>
                <span class="slot-name">{slot1.name || 'Empty'}</span>
              </button>
              <div class="slot-actions">
                <button type="button" class="slot-up-btn" onclick={() => document.getElementById('s1-input')?.click()}>
                  <Upload size={11} />
                  <span>Upload Pic 1</span>
                </button>
                {#if slot1.url}
                  <button type="button" class="slot-del-btn" onclick={() => clearSlot(1)} title="Clear Pic 1"><Trash2 size={11} /></button>
                {/if}
              </div>
              <input type="file" id="s1-input" accept="image/*" onchange={(e) => handleSlotUpload(e, 1)} hidden />
            </div>

            <button type="button" class="swap-action-btn" onclick={swapPictures}>
              <RefreshCw size={11} />
              <span>Swap Pictures 1 ⇄ 2</span>
            </button>

            <div class="slot-box" class:slot-active={activeSlot === 2}>
              <button type="button" class="slot-header-btn" onclick={() => (activeSlot = 2)}>
                <span class="slot-tag">Slot 2</span>
                <span class="slot-name">{slot2.name || 'Empty'}</span>
              </button>
              <div class="slot-actions">
                <button type="button" class="slot-up-btn" onclick={() => document.getElementById('s2-input')?.click()}>
                  <Upload size={11} />
                  <span>Upload Pic 2</span>
                </button>
                {#if slot2.url}
                  <button type="button" class="slot-del-btn" onclick={() => clearSlot(2)} title="Clear Pic 2"><Trash2 size={11} /></button>
                {/if}
              </div>
              <input type="file" id="s2-input" accept="image/*" onchange={(e) => handleSlotUpload(e, 2)} hidden />
            </div>
          </div>

        <!-- 4. STICKERS -->
        {:else if activeTab === 'stickers'}
          <span class="sec-label">Reaction Stickers</span>
          <div class="stickers-grid">
            {#each stickers as s}
              <button type="button" class="sticker-card" onclick={() => addFloatingImage(s.src)} title="Add {s.name}">
                <img src={s.src} alt={s.name} />
                <span>{s.name}</span>
              </button>
            {/each}
          </div>

          <button type="button" class="upload-layer-btn" onclick={() => document.getElementById('layer-file-input')?.click()}>
            <Upload size={12} />
            <span>Upload Custom Picture Layer</span>
          </button>
          <input type="file" id="layer-file-input" accept="image/*" onchange={handleFloatingUpload} hidden />

          <button type="button" class="clear-all-btn" onclick={clearAllStickers}>
            <Trash2 size={11} />
            <span>Clear All Added Stickers</span>
          </button>
        {/if}
      </div>
    </aside>
  </div>
</div>

<style>
  /* 100% Single-Page Compact Viewport Layout */
  .studio-viewport {
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0.5rem 1rem;
  }

  .studio-layout {
    width: 100%;
    max-width: 1320px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    overflow: hidden;
  }

  /* Center Canvas Panel */
  .canvas-panel {
    flex: 1;
    min-width: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    overflow: hidden;
  }

  /* Context Notification Bar */
  .ctx-bar {
    width: 100%;
    max-width: 500px;
    height: 30px;
    min-height: 30px;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    box-sizing: border-box;
    font-size: 0.68rem;
    transition: border-color 0.15s ease;
  }

  .ctx-bar.ctx-active {
    border-color: var(--primary);
    background: var(--surface-elevated);
  }

  .ctx-left {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .ctx-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.1rem 0.35rem;
    border-radius: 3px;
    background: color-mix(in srgb, var(--primary) 15%, transparent);
    color: var(--primary);
    font-weight: 700;
    font-size: 0.65rem;
  }

  .ctx-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    height: 22px;
    padding: 0 0.4rem;
    border-radius: 3px;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--ink);
    font-size: 0.65rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .ctx-btn:hover {
    background: var(--surface-hover);
    color: var(--ink);
  }

  .ctx-btn.danger {
    color: #ef4444;
    border-color: color-mix(in srgb, #ef4444 25%, transparent);
  }

  .ctx-btn.danger:hover {
    background: #ef4444;
    color: #ffffff;
  }

  .ctx-btn.icon {
    padding: 0;
    width: 22px;
    justify-content: center;
    color: var(--text-secondary);
  }

  .ctx-x {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
  }

  .ctx-x:hover {
    background: var(--surface-hover);
    color: var(--ink);
  }

  .ctx-info {
    font-size: 0.68rem;
    color: var(--text-muted);
  }

  /* Canvas Frame */
  .canvas-frame {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    background: var(--surface);
    border: 1px solid var(--line);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    line-height: 0;
  }

  :global(.canvas-container) {
    margin: 0 auto;
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  :global(.canvas-container canvas) {
    display: block;
  }

  /* Toolbar */
  .toolbar {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.65rem;
    background: var(--surface-glass);
    backdrop-filter: blur(20px);
    border: 1px solid var(--line-strong);
    border-radius: 9999px;
    box-shadow: var(--shadow-floating);
  }

  .tb {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid transparent;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
    touch-action: manipulation;
  }

  .tb:hover {
    background: var(--surface-hover);
    color: var(--ink);
  }

  .tb.active, .tb.primary {
    background: var(--primary);
    color: #ffffff;
  }

  .tb.dice {
    color: var(--primary);
    background: color-mix(in srgb, var(--primary) 12%, transparent);
  }

  .tb.dice:hover {
    background: var(--primary);
    color: #ffffff;
  }

  .tb-sep {
    width: 1px;
    height: 18px;
    background: var(--line);
    margin: 0 0.15rem;
  }

  /* Right Sidebar Panel */
  .sidebar-panel {
    width: 360px;
    min-width: 360px;
    height: calc(100vh - 75px);
    max-height: calc(100vh - 75px);
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Tabs */
  .tabs {
    flex-shrink: 0;
    display: flex;
    height: 42px;
    min-height: 42px;
    border-bottom: 1px solid var(--line);
    background: var(--surface-elevated);
    position: relative;
    z-index: 5;
  }

  .tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    border: none;
    background: transparent;
    color: var(--text-muted);
    font-size: 0.74rem;
    font-weight: 600;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.15s ease;
    user-select: none;
    touch-action: manipulation;
    padding: 0 0.4rem;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
  }

  .tab:hover {
    color: var(--ink);
    background: var(--surface-hover);
  }

  .tab.on {
    color: var(--primary);
    border-bottom-color: var(--primary);
    background: var(--surface);
    font-weight: 700;
  }

  .tab * {
    pointer-events: none;
  }

  /* Panel Content Container (Single smooth scroll for entire sidebar) */
  .panel-content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .sec-label {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
  }

  .sub-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  /* Template Tab Controls */
  .action-btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    width: 100%;
    padding: 0.5rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--primary);
    background: color-mix(in srgb, var(--primary) 10%, transparent);
    color: var(--primary);
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .action-btn:hover {
    background: var(--primary);
    color: #ffffff;
  }

  .search-box {
    flex-shrink: 0;
    position: relative;
    width: 100%;
  }

  :global(.search-icon) {
    position: absolute;
    left: 0.65rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    height: 32px;
    padding: 0 0.65rem 0 2rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    background: var(--surface-elevated);
    color: var(--ink);
    font-size: 0.78rem;
    box-sizing: border-box;
    transition: border-color 0.15s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--primary);
  }

  /* 2-Column Template Grid with beautiful proportions */
  .templates-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .tpl-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 120px;
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    padding: 0;
    margin: 0;
    background: var(--surface-elevated);
    cursor: pointer;
    overflow: hidden;
    position: relative;
    transition: all 0.15s ease;
  }

  .tpl-card:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .tpl-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    background: #18181b;
  }

  .tpl-title {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 0.62rem;
    font-weight: 600;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.6) 70%, transparent 100%);
    color: #ffffff;
    padding: 10px 4px 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }

  .load-more-btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    width: 100%;
    padding: 0.45rem;
    border-radius: var(--radius-sm);
    border: 1px dashed var(--line-strong);
    background: transparent;
    color: var(--text-secondary);
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .load-more-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  /* Caption Input Row */
  .input-row {
    display: flex;
    gap: 0.3rem;
  }

  .field-input {
    flex: 1;
    height: 32px;
    padding: 0 0.55rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    background: var(--surface-elevated);
    color: var(--ink);
    font-size: 0.78rem;
    box-sizing: border-box;
  }

  .field-input:focus {
    outline: none;
    border-color: var(--primary);
  }

  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    background: var(--surface-elevated);
    color: var(--ink);
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .add-btn:hover {
    background: var(--line);
  }

  .add-btn.primary-add {
    background: var(--primary);
    color: #ffffff;
    border-color: var(--primary);
  }

  .header-cap-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    padding: 0.4rem;
    border-radius: var(--radius-sm);
    border: 1px dashed var(--primary);
    background: color-mix(in srgb, var(--primary) 8%, transparent);
    color: var(--primary);
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .header-cap-btn:hover {
    background: var(--primary);
    color: #ffffff;
    border-style: solid;
  }

  /* Format Card */
  .format-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.65rem;
    background: var(--surface-elevated);
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
  }

  .font-select {
    width: 100%;
    height: 30px;
    padding: 0 0.5rem;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    color: var(--ink);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
  }

  .font-select:focus {
    border-color: var(--primary);
    outline: none;
  }

  .fmt-buttons {
    display: flex;
    gap: 0.2rem;
  }

  .fmt-btn {
    flex: 1;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .fmt-btn:hover {
    color: var(--ink);
  }

  .fmt-btn.on {
    background: var(--primary);
    border-color: var(--primary);
    color: #ffffff;
  }

  .slider-group {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .slider-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.68rem;
    color: var(--text-secondary);
  }

  .slider-group input[type="range"] {
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    height: 4px;
    border-radius: 9999px;
    background: var(--surface-hover);
    outline: none;
  }

  .slider-group input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--primary);
    cursor: pointer;
  }

  .swatches-row, .bg-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.3rem;
  }

  .swatches {
    display: flex;
    gap: 0.35rem;
  }

  .swatch {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid var(--line-strong);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: transform 0.12s ease;
  }

  .swatch:hover {
    transform: scale(1.15);
  }

  .swatch.selected {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--surface), 0 0 0 3px var(--primary);
  }

  .bg-pills {
    display: flex;
    gap: 0.25rem;
  }

  .bg-pill {
    padding: 0.15rem 0.4rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--text-secondary);
    font-size: 0.65rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .bg-pill:hover {
    color: var(--ink);
  }

  .bg-pill.on {
    background: var(--primary);
    color: #ffffff;
    border-color: var(--primary);
  }

  .picker-row {
    display: flex;
    gap: 0.5rem;
  }

  .color-picker-box {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.3rem 0.5rem;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    font-size: 0.68rem;
    color: var(--text-secondary);
    cursor: pointer;
  }

  .color-picker-box input[type="color"] {
    width: 20px;
    height: 20px;
    border: none;
    background: transparent;
    cursor: pointer;
  }

  .actions-row {
    display: flex;
    gap: 0.35rem;
  }

  .del-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    height: 28px;
    border: 1px solid #f87171;
    background: transparent;
    color: #ef4444;
    border-radius: var(--radius-sm);
    font-size: 0.7rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .del-btn:hover {
    background: #ef4444;
    color: #ffffff;
  }

  .reset-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0 0.5rem;
    height: 28px;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--text-muted);
    border-radius: var(--radius-sm);
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .reset-btn:hover {
    color: var(--ink);
  }

  /* Dual Picture Slots */
  .slots-container {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .slot-box {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 0.55rem;
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    background: var(--surface-elevated);
    transition: border-color 0.15s ease;
  }

  .slot-box.slot-active {
    border-color: var(--primary);
    background: color-mix(in srgb, var(--primary) 8%, transparent);
  }

  .slot-header-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--ink);
  }

  .slot-tag {
    font-size: 0.6rem;
    font-weight: 700;
    padding: 0.1rem 0.35rem;
    border-radius: 3px;
    background: var(--primary);
    color: #ffffff;
  }

  .slot-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .slot-actions {
    display: flex;
    gap: 0.25rem;
  }

  .slot-up-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.35rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--text-secondary);
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .slot-up-btn:hover {
    color: var(--ink);
    border-color: var(--line-strong);
  }

  .slot-del-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .slot-del-btn:hover {
    color: #ef4444;
    border-color: #ef4444;
  }

  .swap-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0.4rem 0.85rem;
    margin: 0 auto;
    border-radius: 99px;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--text-secondary);
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .swap-action-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  /* Stickers */
  .stickers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.4rem;
  }

  .sticker-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.45rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    background: var(--surface-elevated);
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .sticker-card:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
  }

  .sticker-card img {
    width: 38px;
    height: 38px;
    object-fit: contain;
  }

  .sticker-card span {
    font-size: 0.62rem;
    color: var(--text-secondary);
  }

  .upload-layer-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0.45rem;
    border-radius: var(--radius-sm);
    border: 1px dashed var(--line-strong);
    background: transparent;
    color: var(--text-secondary);
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .upload-layer-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  .clear-all-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.35rem;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--text-muted);
    border-radius: var(--radius-sm);
    font-size: 0.65rem;
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .clear-all-btn:hover {
    color: #ef4444;
    border-color: #ef4444;
  }

  :global(.spin) {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ===================================================
     RESPONSIVE MOBILE & TABLET LAYOUT (<= 900px)
     =================================================== */
  @media (max-width: 900px) {
    .studio-viewport {
      height: auto;
      min-height: calc(100vh - 44px);
      max-height: none;
      overflow-y: auto;
      padding: 0.5rem 0.5rem 3rem;
      align-items: flex-start;
      -webkit-overflow-scrolling: touch;
    }

    .studio-layout {
      flex-direction: column;
      height: auto;
      max-width: 100%;
      overflow: visible;
      gap: 0.85rem;
    }

    /* Canvas Section */
    .canvas-panel {
      width: 100%;
      height: auto;
      flex: none;
      overflow: visible;
      gap: 0.45rem;
      align-items: center;
    }

    .ctx-bar {
      width: 100%;
      max-width: min(calc(100vw - 1rem), 520px);
      height: auto;
      min-height: 30px;
      padding: 0.25rem 0.5rem;
      font-size: 0.68rem;
    }

    .ctx-left {
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .ctx-btn {
      height: 22px;
      padding: 0 0.4rem;
      font-size: 0.65rem;
      touch-action: manipulation;
    }

    .canvas-frame {
      width: auto;
      max-width: 100%;
      height: auto;
      margin: 0 auto;
    }

    .toolbar {
      width: auto;
      max-width: min(calc(100vw - 1rem), 520px);
      height: 40px;
      padding: 0.25rem 0.5rem;
      gap: 0.35rem;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }

    .tb {
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      touch-action: manipulation;
    }

    .tb-sep {
      height: 16px;
      margin: 0 0.1rem;
      flex-shrink: 0;
    }

    /* Sidebar Section */
    .sidebar-panel {
      width: 100%;
      min-width: 0;
      max-width: min(calc(100vw - 1rem), 520px);
      height: auto;
      max-height: none;
      overflow: visible;
      margin: 0 auto;
      border-radius: var(--radius-md);
    }

    .tabs {
      height: 42px;
      min-height: 42px;
    }

    .tab {
      font-size: 0.72rem;
      padding: 0 0.3rem;
      gap: 0.25rem;
    }

    .panel-content {
      max-height: 520px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 0.75rem;
    }
  }

  @media (min-width: 601px) and (max-width: 900px) {
    .sidebar-panel {
      max-width: 600px;
    }

    .templates-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }

    .tpl-card {
      height: 120px;
    }
  }

  @media (max-width: 600px) {
    .templates-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.4rem;
    }

    .tpl-card {
      height: 110px;
    }
  }
</style>
