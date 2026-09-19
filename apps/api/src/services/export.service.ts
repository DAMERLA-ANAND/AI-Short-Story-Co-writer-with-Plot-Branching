import { prisma } from '../db.js';
import { calculateActivePath } from './context.service.js';
import PDFDocument from 'pdfkit';

export interface CompiledStoryPath {
  story: {
    id: string;
    title: string;
    genre: string;
    tone: string;
    premise: string;
  };
  scenes: Array<{
    id: string;
    depth: number;
    text: string;
    wordCount: number;
  }>;
  totalWords: number;
  readingMinutes: number;
}

export async function compileActiveStoryPath(storyId: string): Promise<CompiledStoryPath> {
  const story = await prisma.story.findUniqueOrThrow({
    where: { id: storyId },
  });

  const activeSceneId = story.activeSceneId || story.rootSceneId;
  if (!activeSceneId) {
    throw new Error('Story has no active scene');
  }

  const activePathIds = await calculateActivePath(storyId, activeSceneId);

  // Fetch scenes along the active path
  const scenesRaw = await prisma.scene.findMany({
    where: {
      id: { in: activePathIds },
      storyId,
    },
  });

  // Re-sort in exact active path order (root -> leaf)
  const sceneMap = new Map(scenesRaw.map((s) => [s.id, s]));
  const sortedScenes = activePathIds
    .map((id) => sceneMap.get(id))
    .filter(Boolean) as typeof scenesRaw;

  let totalWords = 0;
  const scenes = sortedScenes.map((s) => {
    const wordCount = s.text.trim().split(/\s+/).filter(Boolean).length;
    totalWords += wordCount;
    return {
      id: s.id,
      depth: s.depth,
      text: s.text.trim(),
      wordCount,
    };
  });

  const readingMinutes = Math.max(1, Math.ceil(totalWords / 200));

  return {
    story: {
      id: story.id,
      title: story.title,
      genre: story.genre,
      tone: story.tone,
      premise: story.premise,
    },
    scenes,
    totalWords,
    readingMinutes,
  };
}

export async function compileMarkdownExport(storyId: string): Promise<string> {
  const compiled = await compileActiveStoryPath(storyId);

  const lines: string[] = [];

  // Title Block
  lines.push(`# ${compiled.story.title}`);
  lines.push(`*A ${compiled.story.genre.toUpperCase()} Tale in ${compiled.story.tone} Tone*`);
  lines.push('');
  lines.push(`> **Premise**: ${compiled.story.premise}`);
  lines.push('');
  lines.push(`*Word Count: ~${compiled.totalWords} words • Reading Time: ~${compiled.readingMinutes} mins*`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Narrative Scenes with Clean Transitions
  compiled.scenes.forEach((scene, idx) => {
    if (idx > 0) {
      lines.push('');
      lines.push('* * *');
      lines.push('');
    }

    lines.push(`### Scene ${idx + 1}`);
    lines.push('');

    // Format paragraphs
    const paragraphs = scene.text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    paragraphs.forEach((p) => {
      lines.push(p);
      lines.push('');
    });
  });

  lines.push('---');
  lines.push('*Compiled with PlotWeaver: AI Short Story Co-Writer with Plot Branching*');
  lines.push('');

  return lines.join('\n');
}

export async function compilePdfExport(storyId: string): Promise<Buffer> {
  const compiled = await compileActiveStoryPath(storyId);

  return new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 54, // 0.75 in margins
        autoFirstPage: true,
        bufferPages: true,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // -------------------------------------------------------------
      // COVER / TITLE PAGE
      // -------------------------------------------------------------
      doc.moveDown(4);

      // Title
      doc
        .font('Times-Bold')
        .fontSize(28)
        .fillColor('#111827')
        .text(compiled.story.title, { align: 'center', lineGap: 6 });

      // Subtitle
      doc
        .font('Times-Italic')
        .fontSize(14)
        .fillColor('#4b5563')
        .text(
          `A ${compiled.story.genre.toUpperCase()} Tale • ${compiled.story.tone} Tone`,
          { align: 'center', lineGap: 16 }
        );

      doc.moveDown(1.5);

      // Premise blockquote
      doc
        .font('Times-Italic')
        .fontSize(11)
        .fillColor('#374151')
        .text(`"${compiled.story.premise}"`, {
          align: 'center',
          lineGap: 4,
        });

      doc.moveDown(5);

      // Metadata Block
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor('#9ca3af')
        .text('MANUSCRIPT SPECIFICATIONS', { align: 'center', characterSpacing: 1 });

      doc.moveDown(0.5);

      doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor('#6b7280')
        .text(`Length: ${compiled.scenes.length} Scenes  •  ~${compiled.totalWords} Words`, { align: 'center' })
        .text(`Estimated Reading Time: ~${compiled.readingMinutes} Minutes`, { align: 'center' })
        .text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' })
        .text('Co-written with PlotWeaver AI Studio', { align: 'center' });

      // -------------------------------------------------------------
      // NARRATIVE BODY PAGES
      // -------------------------------------------------------------
      doc.addPage();

      compiled.scenes.forEach((scene, idx) => {
        if (idx > 0) {
          doc.moveDown(1.5);
          doc
            .font('Times-Roman')
            .fontSize(12)
            .fillColor('#9ca3af')
            .text('*   *   *', { align: 'center' });
          doc.moveDown(1.5);
        }

        // Scene Header
        doc
          .font('Helvetica-Bold')
          .fontSize(11)
          .fillColor('#1f2937')
          .text(`SCENE ${idx + 1}`, { characterSpacing: 1.5 });

        doc.moveDown(0.8);

        // Prose Paragraphs
        const paragraphs = scene.text
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean);

        paragraphs.forEach((para) => {
          doc
            .font('Times-Roman')
            .fontSize(11.5)
            .fillColor('#111827')
            .lineGap(5)
            .text(para, {
              align: 'justify',
              indent: 20,
            });

          doc.moveDown(0.8);
        });
      });

      // -------------------------------------------------------------
      // RUNNING HEADERS & FOOTERS
      // -------------------------------------------------------------
      const range = doc.bufferedPageRange();
      const totalPages = range.count;

      // Start numbering from page 2 (body pages)
      for (let i = 1; i < totalPages; i++) {
        doc.switchToPage(i);

        // Running Header (Top right)
        doc
          .font('Helvetica')
          .fontSize(8.5)
          .fillColor('#9ca3af')
          .text(
            compiled.story.title.toUpperCase(),
            54,
            30,
            { align: 'right', width: doc.page.width - 108 }
          );

        // Header rule
        doc
          .strokeColor('#e5e7eb')
          .lineWidth(0.5)
          .moveTo(54, 44)
          .lineTo(doc.page.width - 54, 44)
          .stroke();

        // Running Footer (Bottom center)
        doc
          .font('Helvetica')
          .fontSize(8.5)
          .fillColor('#9ca3af')
          .text(
            `Page ${i + 1} of ${totalPages}`,
            54,
            doc.page.height - 40,
            { align: 'center', width: doc.page.width - 108 }
          );
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
