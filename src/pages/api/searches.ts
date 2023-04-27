import { NextApiRequest, NextApiResponse } from 'next';
import * as console from 'console';
import { postStrapiContent } from '../../utils/strapi';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        console.log(req);
        res.status(200).json(req.body);
    }
    //res.status(200).json({ name: 'John Doe' });
}
