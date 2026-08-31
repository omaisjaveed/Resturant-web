import { Request, Response } from 'express';
import { AboutPageModel } from '../models/aboutPageModel';
import { AuthRequest } from '../middleware/auth';

export class AboutPageController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const content = await AboutPageModel.getAll();
      const contentMap: Record<string, any> = {};
      for (const item of content) {
        contentMap[item.section_key] = {
          value: item.content_value,
          type: item.content_type,
          updated_at: item.updated_at
        };
      }
      res.json({ content: contentMap });
    } catch (error) {
      console.error('Get about page content error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { content } = req.body;

      if (!content || typeof content !== 'object') {
        res.status(400).json({ error: 'Content object is required' });
        return;
      }

      const items = Object.entries(content).map(([key, value]: [string, any]) => ({
        key,
        contentType: value.type || 'text',
        contentValue: typeof value.value === 'string' ? value.value : JSON.stringify(value.value)
      }));

      const success = await AboutPageModel.updateMultiple(items);

      if (success) {
        const updated = await AboutPageModel.getAll();
        const contentMap: Record<string, any> = {};
        for (const item of updated) {
          contentMap[item.section_key] = {
            value: item.content_value,
            type: item.content_type,
            updated_at: item.updated_at
          };
        }
        res.json({ message: 'About page content updated successfully', content: contentMap });
      } else {
        res.status(500).json({ error: 'Failed to update about page content' });
      }
    } catch (error) {
      console.error('Update about page content error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
