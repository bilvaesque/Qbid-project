import {describe,it,expect} from 'vitest';
import {applyAnswer,resolveBids,rankPlayers,freeAnswerOrder,type Player,type Bid} from '../game';
const player=(id:string,extra:Partial<Player>={}):Player=>({id,name:id,avatar:'🦊',wallet:100,marks:0,correct:0,incorrect:0,attempts:0,ready:true,connected:true,host:false,...extra});
describe('Qbid scoring and bidding rules',()=>{
 it('selects the highest bid',()=>{const bids:Bid[]=[{playerId:'a',amount:20,submittedAt:1,passed:false},{playerId:'b',amount:45,submittedAt:2,passed:false},{playerId:'c',amount:30,submittedAt:3,passed:false}];expect(resolveBids(bids,[player('a'),player('b'),player('c')])).toEqual(['b','c','a']);});
 it('uses earliest final submission to break equal bids',()=>{const bids:Bid[]=[{playerId:'a',amount:40,submittedAt:8,passed:false},{playerId:'b',amount:40,submittedAt:4,passed:false}];expect(resolveBids(bids,[player('a'),player('b')])).toEqual(['b','a']);});
 it('refunds half of a correct paid wager and awards ten marks',()=>{const p=applyAnswer(player('a',{wallet:70}),true,30,true,true);expect(p.wallet).toBe(85);expect(p.marks).toBe(10);expect(p.correct).toBe(1);});
 it('does not refund an incorrect paid wager',()=>{const p=applyAnswer(player('a',{wallet:70}),false,30,true,true);expect(p.wallet).toBe(70);expect(p.marks).toBe(0);expect(p.incorrect).toBe(1);});
 it('does not deduct or refund a free answer',()=>{const p=applyAnswer(player('a'),true,0,false);expect(p.wallet).toBe(100);expect(p.marks).toBe(10);});
 it('does not charge players who never receive an answer attempt',()=>{const p=player('a');expect(p.wallet).toBe(100);expect(p.attempts).toBe(0);});
 it('orders no-bid free answers by wallet and then fewer attempts',()=>{const order=freeAnswerOrder([player('a',{wallet:80,attempts:2}),player('b',{wallet:90}),player('c',{wallet:80,attempts:0})]);expect(order.map(p=>p.id)).toEqual(['b','c','a']);});
 it('ranks total-points champion by wallet plus marks',()=>{const ranked=rankPlayers([player('a',{wallet:95,marks:10}),player('b',{wallet:100,marks:0})],'total');expect(ranked[0].id).toBe('a');});
 it('ranks knowledge champion by correct answers',()=>{const ranked=rankPlayers([player('a',{correct:1,marks:10}),player('b',{correct:2,marks:20})],'knowledge');expect(ranked[0].id).toBe('b');});
});
