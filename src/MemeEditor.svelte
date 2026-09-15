<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fabric } from 'fabric';
  import { Square, Columns, LayoutList, Layers, Download, Copy, RefreshCw, Upload, Bold, Italic, Type, AlignLeft, AlignCenter, AlignRight, Search, Plus, Trash2, Image, Dices, Sparkles, Sticker, ExternalLink, ArrowUp, ArrowDown } from '@lucide/svelte';
  import { pureBlankTemplates, localTemplates, curatedMemes, fetchAllInitialBlankTemplates, fetchRedditMemes } from './lib/templatesData';
  import type { MemeTemplate } from './lib/templatesData';

  // Canvas refs and state
  let canvas: fabric.Canvas;
  let isCanvasLoaded = $state(false);
  let canvasEl: HTMLCanvasElement;

  let {
    currentMode = 'dark',
    initialTemplate = null,
    onBack = null
  }: {
    currentMode?: 'dark' | 'light';
    initialTemplate?: MemeTemplate | null;
    onBack?: (() => void) | null;
  } = $props();

  let canvasBgColor = $derived(currentMode === 'light' ? '#ffffff' : '#000000');
  let dividerColor = $derived(currentMode === 'light' ? '#000000' : '#ffffff');
  let handleColor = '#87a665';
  let handleStrokeColor = '#ffffff';

  // Layout mode: 'single' | 'split-h' | 'split-v' | 'collage'
  let activeTab = $state<'text' | 'templates' | 'dual' | 'stickers'>('templates');
  let isRandomizing = $state(false);

  function randomizeTemplate() {
    if (allTemplates.length === 0) return;
    isRandomizing = true;
    const randomIndex = Math.floor(Math.random() * allTemplates.length);
    selectTemplate(allTemplates[randomIndex]);
    setTimeout(() => {
      isRandomizing = false;
    }, 400);
  }

  let layoutMode = $state<'single' | 'split-h' | 'split-v' | 'collage'>('single');
  let activeSlot = $state<1 | 2>(1);

  // Picture slots
  let slot1 = $state<{ url: string; name: string }>({
    url: '/img/girl-running.png',
    name: 'Girl Running'
  });
  let slot2 = $state<{ url: string; name: string }>({
    url: '/img/doge.png',
    name: 'Doge'
  });

  // Canvas appearance
  

  // Text inputs & state
  let topTextInput = $state('');
  let bottomTextInput = $state('');
  let customTextInput = $state('');
  let isTextSelected = $state(false);
  let isObjectSelected = $state(false);
  let isImageSelected = $state(false);
  let hasActiveText = $derived(isTextSelected);

  // Selected object formatting properties
  let textColor = $state('#ffffff');
  let strokeColor = $state('#000000');
  let strokeWidth = $state(2);
  let fontSize = $state(42);
  let fontFamily = $state('Impact');
  let isBold = $state(false);
  let isItalic = $state(false);
  let isAllCaps = $state(true);
  let textAlign = $state<'left' | 'center' | 'right'>('center');

  // Template collection & pagination (Over 10,000+ blank and unwritten canvases)
  let allTemplates = $state<MemeTemplate[]>([...pureBlankTemplates, ...localTemplates, ...curatedMemes]);
  let searchQuery = $state('');
  let selectedCategory = $state('All');
  let visibleCount = $state(48);
  let isLoadingMore = $state(false);
  let totalCatalogCount = $state(10480);
  let copyFeedback = $state(false);

  const categories = ['All', 'Pure Blank', 'Two-Panel', 'Multi-Panel', 'Classic', 'Reactions', 'Animals', 'Gaming'];

  const stickers = [
    { name: 'Doge', src: '/img/doge.png' },
    { name: 'Popcat', src: '/img/popcat.gif' },
    { name: 'Knuckles', src: '/img/knuckles.png' },
    { name: 'Polite Cat', src: '/img/polite-cat.png' },
    { name: 'Surprised Pikachu', src: '/img/surprised-pikachu.png' }
  ];

  // Filtered templates calculation
  let filteredTemplates = $derived(
    allTemplates
      .filter(t => {
        const matchesQuery = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = selectedCategory === 'All' || 
          (selectedCategory === 'Pure Blank' && (t.category === 'Pure Blank' || t.name.includes('(Blank)'))) ||
          (selectedCategory === 'Two-Panel' && (t.category === 'Two-Panel' || t.name.toLowerCase().includes('panel') || t.name.toLowerCase().includes('2'))) ||
          (selectedCategory === 'Multi-Panel' && (t.category === 'Multi-Panel' || (t.boxCount && t.boxCount > 2))) ||
          t.category === selectedCategory;
        return matchesQuery && matchesCat;
      })
      .slice(0, visibleCount)
  );

  $effect(() => {
    if (initialTemplate && isCanvasLoaded) {
      selectTemplate(initialTemplate);
    }
  });

  onMount(async () => {
    isCanvasLoaded = true;
    canvas = new fabric.Canvas(canvasEl, {
      preserveObjectStacking: true,
      backgroundColor: canvasBgColor,
      width: 600,
      height: 600
    });

    canvas.on('selection:created', handleSelectionChange);
    canvas.on('selection:updated', handleSelectionChange);
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

    canvas.on('selection:cleared', () => {
      isTextSelected = false;
      isObjectSelected = false;
      isImageSelected = false;
    });

    if (initialTemplate) {
      slot1 = { url: initialTemplate.url, name: initialTemplate.name };
      if (initialTemplate.category === 'Two-Panel') {
        layoutMode = 'split-h';
      }
    }

    // Render initial layout with default pictures and classic caption layers
    renderLayout();
    addClassicTopText();
    addClassicBottomText();

    // Fetch popular blank online meme templates from Memegen + Imgflip
    const online = await fetchAllInitialBlankTemplates();
    if (online.length > 0) {
      const existingUrls = new Set(allTemplates.map(t => t.url));
      const newOnline = online.filter(t => !existingUrls.has(t.url));
      allTemplates = [...allTemplates, ...newOnline];
    }

    window.addEventListener('keydown', handleKeyDown);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
    if (canvas) canvas.dispose();
  });

  // Render canvas layout based on single, split-h, split-v, or collage
  function renderLayout() {
    if (!canvas) return;

    // Collect user text and stickers (non-panel elements)
    const userElements: fabric.Object[] = [];
    canvas.getObjects().forEach(obj => {
      if ((obj as any).isMemeElement) {
        userElements.push(obj);
      }
    });

    canvas.clear();
    canvas.backgroundColor = canvasBgColor;

    if (layoutMode === 'single') {
      canvas.setWidth(600);
      canvas.setHeight(600);

      if (slot1.url) {
        fabric.Image.fromURL(slot1.url, (img) => {
          if (!img) return;
          const scale = Math.min(600 / (img.width || 600), 600 / (img.height || 600));
          img.set({
            left: 300,
            top: 300,
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
          restoreUserElements(userElements);
        }, { crossOrigin: 'anonymous' });
      } else {
        restoreUserElements(userElements);
      }
    } else if (layoutMode === 'split-h') {
      // 2 Pictures: Side-by-Side
      canvas.setWidth(720);
      canvas.setHeight(480);
      const slotW = 356;
      const slotH = 480;

      // Center Divider line
      const divider = new fabric.Rect({
        left: 358,
        top: 0,
        width: 4,
        height: 480,
        fill: dividerColor,
        selectable: false,
        evented: false
      });
      (divider as any).isPanel = true;
      canvas.add(divider);

      let pending = 2;
      const onDone = () => {
        pending--;
        if (pending <= 0) {
          restoreUserElements(userElements);
        }
      };

      // Slot 1 (Left picture)
      if (slot1.url) {
        fabric.Image.fromURL(slot1.url, (img) => {
          if (img) {
            const scale = Math.min(slotW / (img.width || slotW), slotH / (img.height || slotH));
            img.set({
              left: 178,
              top: 240,
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
          }
          onDone();
        }, { crossOrigin: 'anonymous' });
      } else {
        onDone();
      }

      // Slot 2 (Right picture)
      if (slot2.url) {
        fabric.Image.fromURL(slot2.url, (img) => {
          if (img) {
            const scale = Math.min(slotW / (img.width || slotW), slotH / (img.height || slotH));
            img.set({
              left: 362 + 178,
              top: 240,
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
          }
          onDone();
        }, { crossOrigin: 'anonymous' });
      } else {
        onDone();
      }
    } else if (layoutMode === 'split-v') {
      // 2 Pictures: Top & Bottom
      canvas.setWidth(520);
      canvas.setHeight(720);
      const slotW = 520;
      const slotH = 356;

      // Horizontal Divider line
      const divider = new fabric.Rect({
        left: 0,
        top: 358,
        width: 520,
        height: 4,
        fill: dividerColor,
        selectable: false,
        evented: false
      });
      (divider as any).isPanel = true;
      canvas.add(divider);

      let pending = 2;
      const onDone = () => {
        pending--;
        if (pending <= 0) {
          restoreUserElements(userElements);
        }
      };

      // Slot 1 (Top picture)
      if (slot1.url) {
        fabric.Image.fromURL(slot1.url, (img) => {
          if (img) {
            const scale = Math.min(slotW / (img.width || slotW), slotH / (img.height || slotH));
            img.set({
              left: 260,
              top: 178,
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
          }
          onDone();
        }, { crossOrigin: 'anonymous' });
      } else {
        onDone();
      }

      // Slot 2 (Bottom picture)
      if (slot2.url) {
        fabric.Image.fromURL(slot2.url, (img) => {
          if (img) {
            const scale = Math.min(slotW / (img.width || slotW), slotH / (img.height || slotH));
            img.set({
              left: 260,
              top: 362 + 178,
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
          }
          onDone();
        }, { crossOrigin: 'anonymous' });
      } else {
        onDone();
      }
    } else {
      // Collage / Freeform mode
      canvas.setWidth(600);
      canvas.setHeight(600);
      restoreUserElements(userElements);
    }
  }

  function restoreUserElements(elements: fabric.Object[]) {
    elements.forEach(el => {
      canvas.add(el);
      canvas.bringToFront(el);
    });
    canvas.requestRenderAll();
  }

  // Switch layout mode
  function setLayout(mode: 'single' | 'split-h' | 'split-v' | 'collage') {
    layoutMode = mode;
    renderLayout();
  }

  // Swap Picture 1 and Picture 2
  function swapPictures() {
    const temp = { ...slot1 };
    slot1 = { ...slot2 };
    slot2 = temp;
    renderLayout();
  }

  // Clear specific picture slot
  function clearSlot(slotNum: 1 | 2) {
    if (slotNum === 1) {
      slot1 = { url: '', name: 'Empty Slot' };
    } else {
      slot2 = { url: '', name: 'Empty Slot' };
    }
    renderLayout();
  }

  // Set template into current active slot (or add as floating pic)
  function selectTemplate(t: { url: string; name: string }, scrollToCanvas = false) {
    if (layoutMode === 'collage') {
      addFloatingImage(t.url);
      if (scrollToCanvas && canvasEl) {
        canvasEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (activeSlot === 1) {
      slot1 = { url: t.url, name: t.name };
    } else {
      slot2 = { url: t.url, name: t.name };
    }
    renderLayout();
    if (scrollToCanvas && canvasEl) {
      canvasEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Upload picture to specific slot
  function handleSlotUpload(e: Event, slotNum: 1 | 2) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => {
        const url = f.target?.result as string;
        if (slotNum === 1) {
          slot1 = { url, name: file.name };
        } else {
          slot2 = { url, name: file.name };
        }
        renderLayout();
      };
      reader.readAsDataURL(file);
    }
    target.value = '';
  }

  // Add floating image or sticker
  function addFloatingImage(src: string) {
    if (!canvas) return;
    fabric.Image.fromURL(src, (img) => {
      if (!img) return;
      const canvasW = canvas.getWidth();
      const canvasH = canvas.getHeight();
      const scale = Math.min(canvasW / (img.width || canvasW), canvasH / (img.height || canvasH)) * 0.45;

      img.set({
        left: canvasW / 2,
        top: canvasH / 2,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
        cornerColor: handleColor, borderColor: handleColor, cornerStrokeColor: handleStrokeColor,
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
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => {
        addFloatingImage(f.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    target.value = '';
  }

  // Selection change listener for text and object formatting
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
      const textObj = active as fabric.Textbox;
      textColor = (textObj.fill as string) || '#ffffff';
      strokeColor = (textObj.stroke as string) || '#000000';
      strokeWidth = textObj.strokeWidth || 2;
      fontSize = textObj.fontSize || 42;
      fontFamily = textObj.fontFamily || 'Impact';
      isBold = textObj.fontWeight === 'bold';
      isItalic = textObj.fontStyle === 'italic';
      textAlign = (textObj.textAlign as 'left' | 'center' | 'right') || 'center';
    } else {
      isTextSelected = false;
    }
  }

  // Text management
  function addClassicTopText() {
    if (!canvas) return;
    const text = new fabric.Textbox(topTextInput || 'TOP TEXT', {
      left: canvas.getWidth() / 2,
      top: 50,
      originX: 'center',
      originY: 'center',
      fontSize: 48,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2.5,
      fontFamily: 'Impact',
      textAlign: 'center',
      width: canvas.getWidth() - 40,
      cornerColor: handleColor, borderColor: handleColor, cornerStrokeColor: handleStrokeColor,
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
      top: canvas.getHeight() - 60,
      originX: 'center',
      originY: 'center',
      fontSize: 48,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2.5,
      fontFamily: 'Impact',
      textAlign: 'center',
      width: canvas.getWidth() - 40,
      cornerColor: handleColor, borderColor: handleColor, cornerStrokeColor: handleStrokeColor,
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
      fontSize: 44,
      fill: textColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      fontFamily: fontFamily,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textAlign: textAlign,
      width: 400,
      cornerColor: handleColor, borderColor: handleColor, cornerStrokeColor: handleStrokeColor,
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

  // Text formatting actions
  function updateTextProp(prop: string, val: any) {
    const active = canvas.getActiveObject();
    if (active && active.type === 'textbox') {
      active.set(prop as any, val);
      canvas.requestRenderAll();
    }
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
    const active = canvas.getActiveObject() as fabric.Textbox;
    if (active && active.type === 'textbox' && active.text) {
      isAllCaps = !isAllCaps;
      active.set('text', isAllCaps ? active.text.toUpperCase() : active.text.toLowerCase());
      canvas.requestRenderAll();
    }
  }

  function setTextAlign(align: 'left' | 'center' | 'right') {
    textAlign = align;
    updateTextProp('textAlign', align);
  }

  // Object manipulations
  function deleteSelected() {
    const active = canvas.getActiveObjects();
    if (active.length) {
      active.forEach(obj => {
        if (!(obj as any).isPanel) {
          canvas.remove(obj);
        }
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
          left: (cloned.left || 0) + 20,
          top: (cloned.top || 0) + 20,
          cornerColor: handleColor, borderColor: handleColor, cornerStrokeColor: handleStrokeColor,
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
    const active = canvas.getActiveObject();
    if (active && !(active as any).isPanel) {
      active.set('flipX', !active.flipX);
      canvas.requestRenderAll();
    }
  }

  function bringForward() {
    const active = canvas.getActiveObject();
    if (active && !(active as any).isPanel) {
      canvas.bringToFront(active);
      canvas.requestRenderAll();
    }
  }

  function sendBackward() {
    const active = canvas.getActiveObject();
    if (active && !(active as any).isPanel) {
      canvas.sendBackwards(active);
      // Ensure it stays above panel background
      const panels = canvas.getObjects().filter(o => (o as any).isPanel);
      panels.forEach(p => canvas.sendToBack(p));
      canvas.requestRenderAll();
    }
  }

  function clearAllTextAndStickers() {
    canvas.getObjects().forEach(obj => {
      if ((obj as any).isMemeElement) {
        canvas.remove(obj);
      }
    });
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }

  function clearAllStickers() {
    if (!canvas) return;
    canvas.getObjects().forEach(obj => {
      if ((obj as any).isMemeElement && obj.type === 'image') {
        canvas.remove(obj);
      }
    });
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }

  function handleKeyDown(e: KeyboardEvent) {
    const activeEl = document.activeElement;
    const isEditingInput =
      activeEl &&
      (activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement).isContentEditable);

    const activeObj = canvas?.getActiveObject();
    const isFabricEditing = activeObj && (activeObj as any).isEditing;

    if (isEditingInput || isFabricEditing) {
      return;
    }

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

  // Export & Copy
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
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          copyFeedback = true;
          setTimeout(() => (copyFeedback = false), 2500);
        } catch (err) {
          console.warn('Clipboard write failed:', err);
        }
      }
    });
  }

  // Load more templates pagination (from blank template communities)
  async function loadMoreTemplates() {
    isLoadingMore = true;
    
    try {
      // Fetch fresh community blank templates from r/MemeTemplatesOfficial
      const moreMemes = await fetchRedditMemes(50, 'MemeTemplatesOfficial');
      
      // Ensure no duplicates by url
      const existingUrls = new Set(allTemplates.map(t => t.url));
      const newMemes = moreMemes.filter(t => !existingUrls.has(t.url));
      
      allTemplates = [...allTemplates, ...newMemes];
      totalCatalogCount += newMemes.length;
    } catch (e) {
      console.error(e);
    }

    visibleCount += 36;
    isLoadingMore = false;
  }
</script>

<div class="dynamic-studio-container">
  <!-- Top Workspace: Canvas Area & Tabbed Controls Sidebar -->
  <section class="studio-workspace">
    <!-- Center Canvas Area -->
    <div class="canvas-viewport">
      <div class="canvas-frame">
        <canvas bind:this={canvasEl}></canvas>

        {#if isObjectSelected}
          <!-- Canvas Top Selection Pill for instant edit/delete -->
          <div class="canvas-selection-badge">
            <span class="selection-pill-type">
              {isImageSelected ? 'Image / Sticker' : isTextSelected ? 'Text Caption' : 'Layer Selected'}
            </span>
            <div class="selection-pill-actions">
              <button class="pill-action-btn danger" onclick={deleteSelected} title="Delete Selected Layer (Del / Backspace)">
                <Trash2 size={12} />
                <span>Delete</span>
              </button>
              <button class="pill-action-btn" onclick={duplicateSelected} title="Duplicate Selected (Ctrl+D)">
                <Copy size={12} />
                <span>Duplicate</span>
              </button>
              {#if isImageSelected}
                <button class="pill-action-btn" onclick={flipSelected} title="Flip Horizontally">
                  <RefreshCw size={12} />
                  <span>Flip</span>
                </button>
              {/if}
            </div>
          </div>
        {/if}
      </div>

      <!-- Floating Canvas Toolbar -->
      {#if isCanvasLoaded}
        <div class="floating-toolbar">
          <button class="tool-btn" class:active={layoutMode === 'single'} onclick={() => setLayout('single')} title="1 Picture">
            <Square size={16} strokeWidth={2} />
          </button>
          <button class="tool-btn" class:active={layoutMode === 'split-h'} onclick={() => setLayout('split-h')} title="Side by Side (2 Pictures)">
            <Columns size={16} strokeWidth={2} />
          </button>
          <button class="tool-btn" class:active={layoutMode === 'split-v'} onclick={() => setLayout('split-v')} title="Top & Bottom (2 Pictures)">
            <LayoutList size={16} strokeWidth={2} />
          </button>
          <button class="tool-btn" class:active={layoutMode === 'collage'} onclick={() => setLayout('collage')} title="Freeform Collage">
            <Layers size={16} strokeWidth={2} />
          </button>

          <div class="toolbar-divider"></div>

          <!-- Random Template Dice -->
          <button class="tool-btn random-tool-btn" class:spin={isRandomizing} onclick={randomizeTemplate} title="🎲 Surprise Me (Random Meme)">
            <Dices size={16} strokeWidth={2.2} />
          </button>

          {#if isObjectSelected}
            <div class="toolbar-divider"></div>
            <!-- Contextual Object Actions on Canvas Toolbar -->
            <button class="tool-btn danger" onclick={deleteSelected} title="Delete Selected Layer (Del / Backspace)">
              <Trash2 size={16} strokeWidth={2} />
            </button>
            <button class="tool-btn" onclick={duplicateSelected} title="Duplicate Selected (Ctrl+D)">
              <Copy size={16} strokeWidth={2} />
            </button>
            <button class="tool-btn" onclick={bringForward} title="Bring Forward">
              <ArrowUp size={16} strokeWidth={2} />
            </button>
            <button class="tool-btn" onclick={sendBackward} title="Send Backward">
              <ArrowDown size={16} strokeWidth={2} />
            </button>
            {#if isImageSelected}
              <button class="tool-btn" onclick={flipSelected} title="Flip Horizontally">
                <RefreshCw size={16} strokeWidth={2} />
              </button>
            {/if}
          {/if}

          <div class="toolbar-divider"></div>

          <button class="tool-btn" onclick={copyToClipboard} title="Copy Meme">
            <Copy size={16} strokeWidth={2} />
          </button>
          <button class="tool-btn primary" onclick={exportMeme} title="Export as High-Res PNG">
            <Download size={16} strokeWidth={2} />
          </button>
        </div>
      {/if}
    </div>

    <!-- Right Controls Sidebar (Tabbed & Organized) -->
    <aside class="studio-sidebar">
      <!-- Tabs Header -->
      <nav class="sidebar-nav" aria-label="Tool Panels">
        <button class="sidebar-tab" class:tab-selected={activeTab === 'templates'} onclick={() => activeTab = 'templates'}>
          <Sparkles size={14} />
          <span>Templates</span>
        </button>
        <button class="sidebar-tab" class:tab-selected={activeTab === 'text'} onclick={() => activeTab = 'text'}>
          <Type size={14} />
          <span>Captions</span>
        </button>
        <button class="sidebar-tab" class:tab-selected={activeTab === 'dual'} onclick={() => activeTab = 'dual'}>
          <Columns size={14} />
          <span>2-Pictures</span>
        </button>
        <button class="sidebar-tab" class:tab-selected={activeTab === 'stickers'} onclick={() => activeTab = 'stickers'}>
          <Sticker size={14} />
          <span>Stickers</span>
        </button>
      </nav>

      <!-- Tab Content Panels -->
      <div class="sidebar-body">
        <!-- 1. TEMPLATES TAB -->
        {#if activeTab === 'templates'}
          <div class="panel-box">
            <!-- Surprise Me Button -->
            <button class="action-banner-btn" onclick={randomizeTemplate} title="Pick a Random Meme from 10,000+ templates">
              <Dices size={16} class={isRandomizing ? 'spin' : ''} />
              <span>Surprise Me (Random Template)</span>
            </button>

            <!-- Search -->
            <div class="search-wrapper">
              <Search size={14} class="search-symbol" />
              <input
                type="text"
                class="field-input search-field"
                placeholder="Search 10,000+ templates..."
                bind:value={searchQuery}
              />
            </div>

            <!-- Categories -->
            <div class="category-pills-row">
              {#each categories as cat}
                <button
                  class="cat-pill"
                  class:cat-pill--active={selectedCategory === cat}
                  onclick={() => (selectedCategory = cat)}
                >
                  {cat}
                </button>
              {/each}
            </div>

            <!-- Compact Short Grid -->
            <div class="templates-compact-grid">
              {#each filteredTemplates as t}
                <button
                  class="thumb-card"
                  onclick={() => selectTemplate(t)}
                  title={layoutMode.startsWith('split') ? `Slot ${activeSlot}: ${t.name}` : t.name}
                >
                  <img src={t.url} alt={t.name} loading="lazy" />
                  <span class="thumb-label">{t.name}</span>
                </button>
              {/each}
            </div>

            <button class="pagination-btn" onclick={loadMoreTemplates} disabled={isLoadingMore}>
              {#if isLoadingMore}
                <RefreshCw size={13} class="spin" />
                <span>Loading 100+ more...</span>
              {:else}
                <Plus size={13} />
                <span>Load More (+100 templates)</span>
              {/if}
            </button>
          </div>

        <!-- 2. CAPTIONS & TEXT TAB -->
        {:else if activeTab === 'text'}
          <div class="panel-box">
            <span class="panel-section-title">Add Caption Layers</span>
            <div class="inputs-stack">
              <div class="input-action-group">
                <input
                  type="text"
                  class="field-input"
                  placeholder="TOP TEXT..."
                  bind:value={topTextInput}
                  onkeydown={(e) => e.key === 'Enter' && addClassicTopText()}
                />
                <button class="add-btn" onclick={addClassicTopText} title="Add Top Caption">
                  <Plus size={15} />
                </button>
              </div>

              <div class="input-action-group">
                <input
                  type="text"
                  class="field-input"
                  placeholder="BOTTOM TEXT..."
                  bind:value={bottomTextInput}
                  onkeydown={(e) => e.key === 'Enter' && addClassicBottomText()}
                />
                <button class="add-btn" onclick={addClassicBottomText} title="Add Bottom Caption">
                  <Plus size={15} />
                </button>
              </div>

              <div class="input-action-group">
                <input
                  type="text"
                  class="field-input"
                  placeholder="Custom text layer..."
                  bind:value={customTextInput}
                  onkeydown={(e) => e.key === 'Enter' && addCustomText()}
                />
                <button class="add-btn primary-add" onclick={addCustomText} title="Add Text Layer">
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <!-- Formatting Controls -->
            <div class="formatting-card">
              <span class="panel-section-title">Typography & Style</span>

              <div class="formatting-toggles">
                <button class="fmt-btn" class:fmt-active={isBold} onclick={toggleBold} title="Bold">
                  <Bold size={14} />
                </button>
                <button class="fmt-btn" class:fmt-active={isItalic} onclick={toggleItalic} title="Italic">
                  <Italic size={14} />
                </button>
                <button class="fmt-btn" class:fmt-active={isAllCaps} onclick={toggleAllCaps} title="ALL CAPS">
                  <Type size={14} />
                </button>
                <button class="fmt-btn" class:fmt-active={textAlign === 'left'} onclick={() => setTextAlign('left')} title="Align Left">
                  <AlignLeft size={14} />
                </button>
                <button class="fmt-btn" class:fmt-active={textAlign === 'center'} onclick={() => setTextAlign('center')} title="Align Center">
                  <AlignCenter size={14} />
                </button>
                <button class="fmt-btn" class:fmt-active={textAlign === 'right'} onclick={() => setTextAlign('right')} title="Align Right">
                  <AlignRight size={14} />
                </button>
              </div>

              <!-- Sliders -->
              <div class="range-field">
                <div class="range-header">
                  <span>Font Size</span>
                  <strong>{fontSize}px</strong>
                </div>
                <input
                  type="range"
                  min="16"
                  max="96"
                  step="2"
                  bind:value={fontSize}
                  oninput={(e) => updateTextProp('fontSize', parseInt((e.target as HTMLInputElement).value))}
                  aria-label="Font Size"
                />
              </div>

              <div class="range-field">
                <div class="range-header">
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
                  aria-label="Outline Stroke"
                />
              </div>

              <!-- Colors -->
              <div class="colors-row">
                <label class="color-picker-box">
                  <span>Fill Color</span>
                  <input type="color" bind:value={textColor} oninput={(e) => updateTextProp('fill', (e.target as HTMLInputElement).value)} />
                </label>
                <label class="color-picker-box">
                  <span>Stroke Color</span>
                  <input type="color" bind:value={strokeColor} oninput={(e) => updateTextProp('stroke', (e.target as HTMLInputElement).value)} />
                </label>
              </div>

              <!-- Delete / Reset -->
              <div class="danger-row">
                <button class="delete-btn" onclick={deleteSelected} title="Delete Selected">
                  <Trash2 size={13} />
                  <span>Delete Selected</span>
                </button>
                <button class="reset-btn" onclick={clearAllTextAndStickers} title="Reset Text">
                  <RefreshCw size={13} />
                  <span>Reset All</span>
                </button>
              </div>
            </div>
          </div>

        <!-- 3. DUAL PICTURE TAB -->
        {:else if activeTab === 'dual'}
          <div class="panel-box">
            <span class="panel-section-title">2 Pictures Layout Slots</span>
            <div class="slots-stack">
              <!-- Slot 1 -->
              <div class="slot-item" class:slot-active={activeSlot === 1}>
                <button class="slot-trigger" onclick={() => activeSlot = 1}>
                  <span class="slot-pill">Slot 1</span>
                  <span class="slot-label">{slot1.name || 'Empty'}</span>
                </button>
                <div class="slot-actions-row">
                  <button class="slot-upload-btn" onclick={() => document.getElementById('slot1-uploader')?.click()}>
                    <Upload size={13} />
                    <span>Upload Image 1</span>
                  </button>
                  {#if slot1.url}
                    <button class="slot-clear-btn" onclick={() => clearSlot(1)} title="Clear Slot 1">
                      <Trash2 size={13} />
                    </button>
                  {/if}
                </div>
                <input type="file" id="slot1-uploader" accept="image/*" onchange={(e) => handleSlotUpload(e, 1)} hidden />
              </div>

              <!-- Swap Button -->
              <div class="swap-wrapper">
                <button class="swap-btn" onclick={swapPictures} title="Swap Pictures 1 and 2">
                  <RefreshCw size={13} />
                  <span>Swap Pictures 1 ⇄ 2</span>
                </button>
              </div>

              <!-- Slot 2 -->
              <div class="slot-item" class:slot-active={activeSlot === 2}>
                <button class="slot-trigger" onclick={() => activeSlot = 2}>
                  <span class="slot-pill">Slot 2</span>
                  <span class="slot-label">{slot2.name || 'Empty'}</span>
                </button>
                <div class="slot-actions-row">
                  <button class="slot-upload-btn" onclick={() => document.getElementById('slot2-uploader')?.click()}>
                    <Upload size={13} />
                    <span>Upload Image 2</span>
                  </button>
                  {#if slot2.url}
                    <button class="slot-clear-btn" onclick={() => clearSlot(2)} title="Clear Slot 2">
                      <Trash2 size={13} />
                    </button>
                  {/if}
                </div>
                <input type="file" id="slot2-uploader" accept="image/*" onchange={(e) => handleSlotUpload(e, 2)} hidden />
              </div>
            </div>
          </div>

        <!-- 4. STICKERS TAB -->
        {:else if activeTab === 'stickers'}
          <div class="panel-box">
            <!-- Selected Object Controls in Section Part -->
            <div class="sticker-selection-card" class:has-selection={isObjectSelected}>
              <div class="section-card-header">
                <span class="panel-section-title">
                  {isObjectSelected ? (isImageSelected ? 'Selected Sticker / Overlay' : 'Selected Element') : 'Active Element Controls'}
                </span>
                {#if isObjectSelected}
                  <span class="badge-active">Selected</span>
                {/if}
              </div>

              {#if isObjectSelected}
                <div class="sticker-actions-grid">
                  <button class="danger-action-btn" onclick={deleteSelected} title="Delete selected element (Del / Backspace)">
                    <Trash2 size={14} />
                    <span>Delete Selected</span>
                  </button>
                  <button class="secondary-action-btn" onclick={duplicateSelected} title="Duplicate element (Ctrl+D)">
                    <Copy size={14} />
                    <span>Duplicate</span>
                  </button>
                </div>

                <div class="sticker-layer-controls">
                  <button class="order-btn" onclick={bringForward} title="Bring to Front">
                    <ArrowUp size={13} />
                    <span>Bring to Front</span>
                  </button>
                  <button class="order-btn" onclick={sendBackward} title="Send Backward">
                    <ArrowDown size={13} />
                    <span>Send Backward</span>
                  </button>
                  {#if isImageSelected}
                    <button class="order-btn" onclick={flipSelected} title="Flip Horizontally">
                      <RefreshCw size={13} />
                      <span>Flip Horizontal</span>
                    </button>
                  {/if}
                </div>
              {:else}
                <p class="section-hint">Click any sticker, picture, or caption on the canvas to edit, duplicate, flip, or delete it.</p>
              {/if}

              <!-- Clear all stickers option -->
              <button class="clear-stickers-btn" onclick={clearAllStickers} title="Remove all added stickers & overlays">
                <Trash2 size={13} />
                <span>Clear All Stickers & Overlays</span>
              </button>
            </div>

            <span class="panel-section-title">Reaction Stickers</span>
            <div class="stickers-grid-list">
              {#each stickers as s}
                <button class="sticker-card" onclick={() => addFloatingImage(s.src)} title="Add {s.name}">
                  <img src={s.src} alt={s.name} />
                  <span>{s.name}</span>
                </button>
              {/each}
            </div>

            <div class="custom-upload-section">
              <span class="panel-section-title">Overlay Image Layer</span>
              <button class="upload-stamp-btn" onclick={() => document.getElementById('floating-layer-uploader')?.click()}>
                <Upload size={14} />
                <span>Upload Custom Picture Layer</span>
              </button>
              <input type="file" id="floating-layer-uploader" accept="image/*" onchange={handleFloatingUpload} hidden />
            </div>
          </div>
        {/if}
      </div>
    </aside>
  </section>
</div>

<style>
  /* Dynamic Studio Container (Natural, non-restrictive height) */
  .dynamic-studio-container {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 1.5rem 1.5rem 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    box-sizing: border-box;
  }

  /* Workspace (Canvas + Sidebar) */
  .studio-workspace {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
    width: 100%;
  }

  @media (max-width: 1024px) {
    .studio-workspace {
      flex-direction: column;
      align-items: center;
    }
  }

  /* Canvas Area */
  .canvas-viewport {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .canvas-frame {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-lg);
    background: var(--surface);
    border: 1px solid var(--line);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    position: relative;
  }

  :global(.canvas-container) {
    border-radius: var(--radius-md);
    overflow: hidden;
    max-width: 100% !important;
  }

  :global(.canvas-container canvas) {
    max-width: 100% !important;
    object-fit: contain;
  }

  /* Floating Action Toolbar */
  .floating-toolbar {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.45rem 0.85rem;
    margin-top: 1.25rem;
    background: var(--surface-glass);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--line-strong);
    border-radius: 9999px;
    box-shadow: var(--shadow-floating);
    z-index: 20;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .tool-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid transparent;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .tool-btn:hover {
    background: var(--surface-hover);
    color: var(--ink);
  }

  .tool-btn.active {
    background: var(--primary);
    color: #ffffff;
  }

  .tool-btn.primary {
    background: var(--primary);
    color: #ffffff;
  }

  .tool-btn.primary:hover {
    transform: scale(1.05);
  }

  .tool-btn.random-tool-btn {
    color: var(--primary);
    background: color-mix(in srgb, var(--primary) 15%, transparent);
  }

  .tool-btn.random-tool-btn:hover {
    background: var(--primary);
    color: #ffffff;
  }

  .toolbar-divider {
    width: 1px;
    height: 20px;
    background: var(--line);
    margin: 0 0.2rem;
  }

  /* Sidebar */
  .studio-sidebar {
    width: 360px;
    min-width: 360px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  @media (max-width: 1024px) {
    .studio-sidebar {
      width: 100%;
      min-width: 0;
      max-width: 600px;
    }
  }

  /* Sidebar Tabs */
  .sidebar-nav {
    display: flex;
    height: 46px;
    min-height: 46px;
    border-bottom: 1px solid var(--line);
    background: var(--surface-elevated);
  }

  .sidebar-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    border: none;
    background: transparent;
    color: var(--text-muted);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    border-bottom: 2px solid transparent;
  }

  .sidebar-tab:hover {
    color: var(--ink);
    background: var(--surface-hover);
  }

  .sidebar-tab.tab-selected {
    color: var(--primary);
    border-bottom-color: var(--primary);
    background: var(--surface);
  }

  /* Sidebar Body */
  .sidebar-body {
    padding: 1.25rem;
    max-height: 620px;
    overflow-y: auto;
  }

  .panel-box {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .panel-section-title {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
  }

  /* Action Banner Button */
  .action-banner-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.7rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--primary);
    background: color-mix(in srgb, var(--primary) 12%, transparent);
    color: var(--primary);
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .action-banner-btn:hover {
    background: var(--primary);
    color: #ffffff;
  }

  /* Search */
  .search-wrapper {
    position: relative;
    width: 100%;
  }

  :global(.search-symbol) {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
  }

  .field-input {
    width: 100%;
    height: 38px;
    padding: 0 0.75rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    background: var(--surface-elevated);
    color: var(--ink);
    font-family: inherit;
    font-size: 0.85rem;
    box-sizing: border-box;
    transition: border-color 0.15s ease;
  }

  .field-input:focus {
    outline: none;
    border-color: var(--primary);
  }

  .search-field {
    padding-left: 2.2rem;
  }

  /* Category Pills */
  .category-pills-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .cat-pill {
    padding: 0.25rem 0.65rem;
    border-radius: 99px;
    border: 1px solid var(--line);
    background: var(--surface-elevated);
    color: var(--text-secondary);
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .cat-pill:hover {
    color: var(--ink);
    border-color: var(--line-strong);
  }

  .cat-pill.cat-pill--active {
    background: var(--primary);
    color: #ffffff;
    border-color: var(--primary);
  }

  /* Compact Grid */
  .templates-compact-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    max-height: 380px;
    overflow-y: auto;
    padding-right: 0.25rem;
  }

  .thumb-card {
    aspect-ratio: 1;
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    padding: 0;
    background: var(--surface-elevated);
    cursor: pointer;
    overflow: hidden;
    position: relative;
    transition: all 0.15s ease;
  }

  .thumb-card:hover {
    border-color: var(--primary);
    transform: scale(1.03);
  }

  .thumb-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .thumb-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 0.62rem;
    background: rgba(0,0,0,0.75);
    color: #fff;
    padding: 2px 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }

  .pagination-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    width: 100%;
    padding: 0.55rem;
    border-radius: var(--radius-sm);
    border: 1px dashed var(--line-strong);
    background: transparent;
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .pagination-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  /* Inputs Stack */
  .inputs-stack {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .input-action-group {
    display: flex;
    gap: 0.45rem;
  }

  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    background: var(--surface-elevated);
    color: var(--ink);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .add-btn:hover {
    background: var(--line);
  }

  .add-btn.primary-add {
    background: var(--primary);
    color: #ffffff;
    border-color: var(--primary);
  }

  /* Formatting Card */
  .formatting-card {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    padding: 0.85rem;
    background: var(--surface-elevated);
    border-radius: var(--radius-md);
    border: 1px solid var(--line);
  }

  .formatting-toggles {
    display: flex;
    gap: 0.3rem;
  }

  .fmt-btn {
    flex: 1;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .fmt-btn:hover {
    color: var(--ink);
  }

  .fmt-btn.fmt-active {
    background: var(--primary);
    border-color: var(--primary);
    color: #ffffff;
  }

  .range-field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .range-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .range-field input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    border-radius: 9999px;
    background: var(--surface-hover);
    outline: none;
    transition: all 0.15s ease;
  }

  .range-field input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--primary);
    cursor: pointer;
    box-shadow: 0 0 10px var(--primary-glow);
    transition: transform 0.15s ease;
  }

  .range-field input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.25);
  }

  .colors-row {
    display: flex;
    gap: 0.75rem;
  }

  .color-picker-box {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem 0.65rem;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    color: var(--text-secondary);
    cursor: pointer;
  }

  .color-picker-box input[type="color"] {
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    cursor: pointer;
  }

  .danger-row {
    display: flex;
    gap: 0.5rem;
  }

  .delete-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    height: 32px;
    border: 1px solid #f87171;
    background: transparent;
    color: #ef4444;
    border-radius: var(--radius-sm);
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .delete-btn:hover {
    background: #ef4444;
    color: #ffffff;
  }

  .reset-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0 0.75rem;
    height: 32px;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--text-muted);
    border-radius: var(--radius-sm);
    font-size: 0.78rem;
    cursor: pointer;
  }

  .reset-btn:hover {
    color: var(--ink);
  }

  /* Dual Slots */
  .slots-stack {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .slot-item {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    padding: 0.75rem;
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    background: var(--surface-elevated);
    transition: all 0.15s ease;
  }

  .slot-item.slot-active {
    border-color: var(--primary);
    background: color-mix(in srgb, var(--primary) 8%, transparent);
  }

  .slot-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    text-align: left;
  }

  .slot-pill {
    font-size: 0.65rem;
    font-weight: 700;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    background: var(--primary);
    color: #ffffff;
  }

  .slot-label {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .slot-actions-row {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .slot-upload-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0.4rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--text-secondary);
    font-size: 0.78rem;
    cursor: pointer;
  }

  .slot-upload-btn:hover {
    color: var(--ink);
    border-color: var(--line-strong);
  }

  .slot-clear-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .slot-clear-btn:hover {
    color: #ef4444;
    border-color: #ef4444;
    background: color-mix(in srgb, #ef4444 10%, transparent);
  }

  .swap-wrapper {
    display: flex;
    justify-content: center;
  }

  .swap-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 1rem;
    border-radius: 99px;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--text-secondary);
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .swap-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  /* Stickers */
  .stickers-grid-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .sticker-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    padding: 0.5rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    background: var(--surface-elevated);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .sticker-card:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
  }

  .sticker-card img {
    width: 42px;
    height: 42px;
    object-fit: contain;
  }

  .sticker-card span {
    font-size: 0.68rem;
    color: var(--text-secondary);
  }

  .custom-upload-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--line);
  }

  .upload-stamp-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.6rem;
    border-radius: var(--radius-sm);
    border: 1px dashed var(--line-strong);
    background: transparent;
    color: var(--text-secondary);
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .upload-stamp-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  /* Canvas Top Selection Pill */
  .canvas-selection-badge {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.35rem 0.65rem 0.35rem 0.85rem;
    background: var(--surface-glass);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--line-strong);
    border-radius: 9999px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    z-index: 15;
  }

  .selection-pill-type {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  .selection-pill-actions {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .pill-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.22rem 0.55rem;
    border-radius: 9999px;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--text-secondary);
    font-size: 0.7rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .pill-action-btn:hover {
    color: var(--ink);
    border-color: var(--line-strong);
    background: var(--surface-hover);
  }

  .pill-action-btn.danger {
    color: #ef4444;
    border-color: color-mix(in srgb, #ef4444 35%, transparent);
  }

  .pill-action-btn.danger:hover {
    background: #ef4444;
    color: #ffffff;
    border-color: #ef4444;
  }

  /* Toolbar Danger Action */
  .tool-btn.danger {
    color: #ef4444;
  }

  .tool-btn.danger:hover {
    background: #ef4444;
    color: #ffffff;
  }

  /* Sticker Selection Panel in Section Part */
  .sticker-selection-card {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    padding: 0.8rem;
    background: var(--surface-elevated);
    border-radius: var(--radius-md);
    border: 1px solid var(--line);
    transition: all 0.2s ease;
  }

  .sticker-selection-card.has-selection {
    border-color: var(--primary);
  }

  .section-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .badge-active {
    font-size: 0.65rem;
    font-weight: 700;
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    background: color-mix(in srgb, var(--primary) 18%, transparent);
    color: var(--primary);
    border: 1px solid var(--primary);
  }

  .sticker-actions-grid {
    display: flex;
    gap: 0.5rem;
  }

  .danger-action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    height: 34px;
    border: 1px solid #ef4444;
    background: color-mix(in srgb, #ef4444 12%, transparent);
    color: #ef4444;
    border-radius: var(--radius-sm);
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .danger-action-btn:hover {
    background: #ef4444;
    color: #ffffff;
  }

  .secondary-action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    height: 34px;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--ink);
    border-radius: var(--radius-sm);
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .secondary-action-btn:hover {
    background: var(--surface-hover);
    border-color: var(--line-strong);
  }

  .sticker-layer-controls {
    display: flex;
    gap: 0.35rem;
  }

  .order-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    height: 30px;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    font-size: 0.72rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .order-btn:hover {
    color: var(--ink);
    background: var(--surface-hover);
  }

  .section-hint {
    font-size: 0.75rem;
    color: var(--text-muted);
    line-height: 1.4;
    margin: 0;
  }

  .clear-stickers-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0.45rem;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--text-muted);
    border-radius: var(--radius-sm);
    font-size: 0.72rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .clear-stickers-btn:hover {
    color: #ef4444;
    border-color: #ef4444;
    background: color-mix(in srgb, #ef4444 8%, transparent);
  }

  :global(.spin) {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
