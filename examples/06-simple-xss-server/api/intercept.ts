import { NowRequest, NowResponse } from '@now/node';

export default (req: NowRequest, res: NowResponse) => {
  console.log(JSON.parse(req.body));
  res.status(200).send('Thank you');
};
