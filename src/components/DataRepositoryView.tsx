import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Table, 
  HardDrive, 
  Filter, 
  Search, 
  ArrowDownToLine, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  Activity, 
  ChevronRight, 
  ArrowUpRight, 
  BarChart2, 
  Radio, 
  Server, 
  FileText, 
  CheckCircle2, 
  Code2, 
  SlidersHorizontal,
  X,
  Plus
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { ViewTab } from '../types';
import { ResizableSplit } from './ui/ResizableSplit';
import { useFailureState } from '../context/FailureContext';

export interface DatasetColumn {
  name: string;
  type: string;
  nullable: boolean;
  isKey?: boolean;
  description: string;
}

export interface DatasetItem {
  id: string;
  name: string;
  identifier: string;
  category: 'market-depth' | 'factor-alpha' | 'alternative-nlp' | 'execution-tca';
  categoryLabel: string;
  description: string;
  provider: string;
  colocation: string;
  frequency: string;
  format: 'Parquet' | 'Arrow IPC' | 'Delta Lake' | 'Apache Iceberg' | 'ClickHouse';
  size: string;
  rowCount: string;
  completeness: string;
  lastUpdated: string;
  isLiveStream: boolean;
  latency?: string;
  feedHealth?: 'LIVE' | 'DELAYED' | 'DOWN';
  affectedNodes?: string[];
  stalenessReason?: string;
  tags: string[];
  schema: DatasetColumn[];
  sampleData: Record<string, string | number>[];
  querySnippet: string;
}

const MOCK_DATASETS: DatasetItem[] = [
  {
    id: 'ds-us-l2-depth',
    name: 'US Equity Level 2 Market Depth',
    identifier: 'us_equities_l2_depth',
    category: 'market-depth',
    categoryLabel: 'Market & Order Book',
    description: 'Consolidated 10-level Nasdaq TotalView and NYSE OpenBook order book depth with microsecond trade prints and order flow imbalances.',
    provider: 'Direct Colocation Feed (Equinix NY4)',
    colocation: 'NY4 Cross-Connect (10Gbps Raw DMA)',
    frequency: 'Tick Streaming (Sub-millisecond)',
    format: 'Arrow IPC',
    size: '4.8 TB',
    rowCount: '1.42B rows',
    completeness: '99.999%',
    lastUpdated: 'Live Streaming (0.04 ms ago)',
    isLiveStream: true,
    latency: '0.04 ms',
    tags: ['L2 Depth', 'Order Imbalance', 'Ticks', 'Equities'],
    schema: [
      { name: 'timestamp_ns', type: 'int64', nullable: false, isKey: true, description: 'Epoch nanoseconds timestamp from exchange matching engine' },
      { name: 'ticker', type: 'string', nullable: false, isKey: true, description: 'US Equity ticker symbol (e.g., NVDA, AAPL, MSFT)' },
      { name: 'bid_px_0', type: 'float64', nullable: false, description: 'Best bid price Level 0 (inside market)' },
      { name: 'bid_sz_0', type: 'int32', nullable: false, description: 'Aggregated bid size in shares at Level 0' },
      { name: 'ask_px_0', type: 'float64', nullable: false, description: 'Best ask price Level 0 (inside market)' },
      { name: 'ask_sz_0', type: 'int32', nullable: false, description: 'Aggregated ask size in shares at Level 0' },
      { name: 'micro_price', type: 'float64', nullable: false, description: 'Volume-weighted mid price: (P_ask*S_bid + P_bid*S_ask)/(S_bid+S_ask)' },
      { name: 'spread_bps', type: 'float32', nullable: false, description: 'Bid-ask spread expressed in basis points' },
      { name: 'order_imbalance', type: 'float32', nullable: false, description: 'Normalized order book imbalance ratio [-1.0, 1.0]' },
      { name: 'venue_code', type: 'string', nullable: false, description: 'Executing exchange identifier (XNGS, XNYS, EDGX, BATS)' },
    ],
    sampleData: [
      { timestamp_ns: 1726002140000000000, ticker: 'NVDA', bid_px_0: 124.50, bid_sz_0: 14200, ask_px_0: 124.52, ask_sz_0: 8900, micro_price: 124.512, spread_bps: 1.6, order_imbalance: 0.23, venue_code: 'XNGS' },
      { timestamp_ns: 1726002140001000000, ticker: 'NVDA', bid_px_0: 124.51, bid_sz_0: 9800, ask_px_0: 124.52, ask_sz_0: 7400, micro_price: 124.516, spread_bps: 0.8, order_imbalance: 0.14, venue_code: 'XNGS' },
      { timestamp_ns: 1726002140002000000, ticker: 'AAPL', bid_px_0: 220.15, bid_sz_0: 21500, ask_px_0: 220.16, ask_sz_0: 19800, micro_price: 220.155, spread_bps: 0.5, order_imbalance: 0.04, venue_code: 'XNGS' },
      { timestamp_ns: 1726002140003000000, ticker: 'MSFT', bid_px_0: 428.80, bid_sz_0: 4300, ask_px_0: 428.85, ask_sz_0: 5100, micro_price: 428.823, spread_bps: 1.2, order_imbalance: -0.09, venue_code: 'XNGS' },
      { timestamp_ns: 1726002140004000000, ticker: 'JPM', bid_px_0: 204.30, bid_sz_0: 8400, ask_px_0: 204.32, ask_sz_0: 6200, micro_price: 204.312, spread_bps: 0.9, order_imbalance: 0.15, venue_code: 'XNYS' },
      { timestamp_ns: 1726002140005000000, ticker: 'UNH', bid_px_0: 572.20, bid_sz_0: 1600, ask_px_0: 572.30, ask_sz_0: 2200, micro_price: 572.242, spread_bps: 1.7, order_imbalance: -0.16, venue_code: 'XNYS' },
    ],
    querySnippet: `# DE SHAW SYSTEMATIC QUANTITATIVE REPOSITORY
import pyarrow.dataset as ds
import polars as pl

# Connect to NY4 colocation streaming buffer
dataset = ds.dataset("repo://market_depth/us_equities_l2_depth", format="arrow_ipc")
table = dataset.to_table(
    filter=(ds.field("ticker") == "NVDA") & (ds.field("spread_bps") < 2.0),
    columns=["timestamp_ns", "ticker", "bid_px_0", "ask_px_0", "order_imbalance"]
)
df = pl.from_arrow(table)
print(df.tail(10))`
  },
  {
    id: 'ds-cross-asset-cov',
    name: 'Multi-Asset Factor Covariance Matrix',
    identifier: 'cross_asset_covariance_matrix',
    category: 'factor-alpha',
    categoryLabel: 'Factor & Alpha Signals',
    description: 'Rolling 60-day and 252-day factor covariance matrices, idiosyncratic residual risk, and Barra style factor loadings for Markowitz portfolio optimization.',
    provider: 'DE Shaw Quantitative Risk Engine (Q-Alpha)',
    colocation: 'Internal Compute Cluster (NY4 / AWS DirectConnect)',
    frequency: 'Daily EOD + Intraday Hourly Re-estimation',
    format: 'Delta Lake',
    size: '420 GB',
    rowCount: '28.5M matrix entries',
    completeness: '100.00%',
    lastUpdated: 'Today at 16:30 EST',
    isLiveStream: false,
    latency: '1.2s batch',
    tags: ['Covariance', 'Factor Risk', 'Barra Model', 'Sharpe'],
    schema: [
      { name: 'date', type: 'date32', nullable: false, isKey: true, description: 'Calculation trading calendar date' },
      { name: 'asset_a', type: 'string', nullable: false, isKey: true, description: 'Base asset identifier (RIC / Ticker)' },
      { name: 'asset_b', type: 'string', nullable: false, isKey: true, description: 'Covariance pair asset identifier' },
      { name: 'covariance_60d', type: 'float64', nullable: false, description: 'Annualized 60-day rolling covariance' },
      { name: 'correlation_60d', type: 'float32', nullable: false, description: 'Pearson correlation coefficient [-1.0, 1.0]' },
      { name: 'beta_sp500', type: 'float32', nullable: false, description: 'Factor beta to S&P 500 Market Benchmark' },
      { name: 'idiosyncratic_vol', type: 'float32', nullable: false, description: 'Annualized stock-specific residual volatility' },
      { name: 'factor_cluster', type: 'string', nullable: false, description: 'Primary risk cluster (Tech-Momentum, Large-Value, Macro-Rates)' },
    ],
    sampleData: [
      { date: '2026-09-10', asset_a: 'NVDA', asset_b: 'AAPL', covariance_60d: 0.0482, correlation_60d: 0.62, beta_sp500: 1.64, idiosyncratic_vol: 0.284, factor_cluster: 'Tech-Momentum' },
      { date: '2026-09-10', asset_a: 'NVDA', asset_b: 'MSFT', covariance_60d: 0.0514, correlation_60d: 0.68, beta_sp500: 1.64, idiosyncratic_vol: 0.284, factor_cluster: 'Tech-Momentum' },
      { date: '2026-09-10', asset_a: 'AAPL', asset_b: 'MSFT', covariance_60d: 0.0391, correlation_60d: 0.74, beta_sp500: 1.18, idiosyncratic_vol: 0.192, factor_cluster: 'Large-Growth' },
      { date: '2026-09-10', asset_a: 'JPM', asset_b: 'BAC', covariance_60d: 0.0410, correlation_60d: 0.81, beta_sp500: 0.94, idiosyncratic_vol: 0.165, factor_cluster: 'Financials-Rates' },
      { date: '2026-09-10', asset_a: 'NVDA', asset_b: 'SPY', covariance_60d: 0.0385, correlation_60d: 0.79, beta_sp500: 1.64, idiosyncratic_vol: 0.284, factor_cluster: 'Benchmark-Core' },
    ],
    querySnippet: `# PULL FACTOR RISK COVARIANCE IN PYTHON
from deshaw_quant import RiskCatalog

catalog = RiskCatalog(env="production")
cov_matrix = catalog.get_covariance_matrix(
    universe=["NVDA", "AAPL", "MSFT", "JPM", "UNH"],
    lookback_days=60,
    regularization="ledoit_wolf"
)
print("Eigenvalues:", cov_matrix.eigenvalues())`
  },
  {
    id: 'ds-cme-futures',
    name: 'CME Globex Index Futures Order Flow',
    identifier: 'es_nq_futures_tick_feed',
    category: 'market-depth',
    categoryLabel: 'Market & Order Book',
    description: 'Ultra-low latency front-month E-mini S&P 500 (ES) and Nasdaq 100 (NQ) futures book events from CME Globex Aurora co-lo facility.',
    provider: 'CME Globex Direct Feed (Aurora Co-Lo)',
    colocation: 'Aurora CME Data Center (Direct Multicast A/B)',
    frequency: 'Real-Time Streaming (<50 microseconds)',
    format: 'Arrow IPC',
    size: '1.9 TB',
    rowCount: '890M prints',
    completeness: '99.998%',
    lastUpdated: 'Live Streaming (0.08 ms ago)',
    isLiveStream: true,
    latency: '0.08 ms',
    tags: ['Futures', 'CME Globex', 'ES/NQ', 'Hedging Overlay'],
    schema: [
      { name: 'event_time_ns', type: 'int64', nullable: false, isKey: true, description: 'Nanosecond timestamp of Globex matching engine book update' },
      { name: 'contract_symbol', type: 'string', nullable: false, isKey: true, description: 'Futures contract code (e.g., ESZ24, NQZ24)' },
      { name: 'trade_price', type: 'float64', nullable: true, description: 'Last traded contract price' },
      { name: 'trade_volume', type: 'int32', nullable: true, description: 'Executed trade size in contracts' },
      { name: 'aggressor_side', type: 'string', nullable: true, description: 'Trade side classification (BUY, SELL, UNKNOWN)' },
      { name: 'bbo_bid_price', type: 'float64', nullable: false, description: 'Best bid price at event time' },
      { name: 'bbo_ask_price', type: 'float64', nullable: false, description: 'Best ask price at event time' },
      { name: 'depth_total_contracts', type: 'int32', nullable: false, description: 'Sum of contracts across top 5 depth tiers' },
    ],
    sampleData: [
      { event_time_ns: 1726002142100000000, contract_symbol: 'ESZ24', trade_price: 5542.25, trade_volume: 12, aggressor_side: 'BUY', bbo_bid_price: 5542.00, bbo_ask_price: 5542.25, depth_total_contracts: 412 },
      { event_time_ns: 1726002142100500000, contract_symbol: 'ESZ24', trade_price: 5542.25, trade_volume: 5, aggressor_side: 'BUY', bbo_bid_price: 5542.00, bbo_ask_price: 5542.25, depth_total_contracts: 407 },
      { event_time_ns: 1726002142101000000, contract_symbol: 'NQZ24', trade_price: 19410.50, trade_volume: 8, aggressor_side: 'SELL', bbo_bid_price: 19410.50, bbo_ask_price: 19411.00, depth_total_contracts: 195 },
      { event_time_ns: 1726002142101500000, contract_symbol: 'NQZ24', trade_price: 19410.50, trade_volume: 14, aggressor_side: 'SELL', bbo_bid_price: 19410.25, bbo_ask_price: 19410.75, depth_total_contracts: 201 },
    ],
    querySnippet: `# STREAM CME GLOBEX FUTURES DATA
import asyncio
from deshaw_streams import GlobexConsumer

consumer = GlobexConsumer(symbols=["ESZ24", "NQZ24"], co_lo="aurora")
async for tick in consumer.listen():
    if tick.aggressor_side == "BUY" and tick.trade_volume >= 10:
        print(f"Large Futures Aggressor: {tick.contract_symbol} @ {tick.trade_price}")`
  },
  {
    id: 'ds-sec-xbrl',
    name: 'SEC EDGAR XBRL Financial Statements',
    identifier: 'sec_edgar_xbrl_fundamentals',
    category: 'alternative-nlp',
    categoryLabel: 'Alternative & NLP',
    description: 'Cleaned, normalized, point-in-time balance sheets, income statements, free cash flow statements, and capital return disclosures directly from SEC 10-K/10-Q filings.',
    provider: 'SEC EDGAR Public Disclosures Stream',
    colocation: 'US-East Cloud ETL Pipeline',
    frequency: 'Continuous Ingestion (Event-driven)',
    format: 'Parquet',
    size: '180 GB',
    rowCount: '4.2M line items',
    completeness: '99.94%',
    lastUpdated: '12 mins ago',
    isLiveStream: false,
    latency: '5.4s ETL',
    tags: ['Fundamentals', 'SEC EDGAR', 'XBRL', 'Cash Flow', '10-K'],
    schema: [
      { name: 'accession_number', type: 'string', nullable: false, isKey: true, description: 'SEC EDGAR unique filing identifier' },
      { name: 'cik', type: 'string', nullable: false, isKey: true, description: 'Central Index Key for company' },
      { name: 'ticker', type: 'string', nullable: false, description: 'Trading ticker symbol' },
      { name: 'period_end_date', type: 'date32', nullable: false, description: 'Fiscal period ending date' },
      { name: 'form_type', type: 'string', nullable: false, description: 'Filing type: 10-K, 10-Q, 8-K' },
      { name: 'total_revenue_usd', type: 'float64', nullable: true, description: 'Reported total operating revenue in USD' },
      { name: 'operating_income_usd', type: 'float64', nullable: true, description: 'Operating income (EBIT) in USD' },
      { name: 'free_cash_flow_usd', type: 'float64', nullable: true, description: 'Operating cash flow minus CapEx' },
      { name: 'net_margin_pct', type: 'float32', nullable: true, description: 'Net income divided by total revenue' },
    ],
    sampleData: [
      { accession_number: '0001045810-24-000084', cik: '0001045810', ticker: 'NVDA', period_end_date: '2026-07-28', form_type: '10-Q', total_revenue_usd: 30040000000, operating_income_usd: 18642000000, free_cash_flow_usd: 13480000000, net_margin_pct: 55.4 },
      { accession_number: '0000320193-24-000106', cik: '0000320193', ticker: 'AAPL', period_end_date: '2026-06-29', form_type: '10-Q', total_revenue_usd: 85777000000, operating_income_usd: 25352000000, free_cash_flow_usd: 21200000000, net_margin_pct: 25.0 },
      { accession_number: '0000789019-24-000045', cik: '0000789019', ticker: 'MSFT', period_end_date: '2026-06-30', form_type: '10-K', total_revenue_usd: 64727000000, operating_income_usd: 27925000000, free_cash_flow_usd: 23300000000, net_margin_pct: 34.0 },
      { accession_number: '0000019617-24-000392', cik: '0000019617', ticker: 'JPM', period_end_date: '2026-06-30', form_type: '10-Q', total_revenue_usd: 50989000000, operating_income_usd: 18140000000, free_cash_flow_usd: 15400000000, net_margin_pct: 35.6 },
    ],
    querySnippet: `# PULL SEC EDGAR NORMALIZED XBRL DATA
import duckdb

conn = duckdb.connect()
res = conn.execute("""
    SELECT ticker, period_end_date, total_revenue_usd / 1e9 as rev_billions, net_margin_pct
    FROM 'repo://fundamentals/sec_edgar_xbrl_fundamentals.parquet'
    WHERE form_type IN ('10-K', '10-Q')
    ORDER BY period_end_date DESC
    LIMIT 10
""").df()
print(res)`
  },
  {
    id: 'ds-nlp-transcripts',
    name: 'Earnings Call NLP Tone & Vector Embeddings',
    identifier: 'nlp_earnings_transcript_sentiment',
    category: 'alternative-nlp',
    categoryLabel: 'Alternative & NLP',
    description: 'Sentence-by-sentence executive confidence scores, forward-looking guidance vectors, and 768-dim dense embeddings extracted using fine-tuned FinBERT models.',
    provider: 'FactSet Transcripts + In-house LLM Pipeline',
    colocation: 'GPU Inference Cluster (A100 Cluster)',
    frequency: 'Event-driven (Published within 15m of call)',
    format: 'Delta Lake',
    size: '340 GB',
    rowCount: '6.8M embeddings',
    completeness: '99.80%',
    lastUpdated: '1 hour ago',
    isLiveStream: false,
    latency: '14 mins',
    tags: ['NLP', 'Sentiment', 'Earnings Calls', 'Vector Index'],
    schema: [
      { name: 'call_id', type: 'string', nullable: false, isKey: true, description: 'Unique transcript session identifier' },
      { name: 'ticker', type: 'string', nullable: false, description: 'Company ticker' },
      { name: 'speaker_role', type: 'string', nullable: false, description: 'Speaker classification: CEO, CFO, Analyst, Other' },
      { name: 'section', type: 'string', nullable: false, description: 'Prepared Remarks or Q&A segment' },
      { name: 'sentiment_score', type: 'float32', nullable: false, description: 'Calibrated tone score [-1.0 to +1.0]' },
      { name: 'guidance_upgrade_prob', type: 'float32', nullable: false, description: 'Model probability of positive future guidance revision' },
      { name: 'extracted_excerpt', type: 'string', nullable: false, description: 'Exact verbatim sentence from the transcript' },
    ],
    sampleData: [
      { call_id: 'NVDA-2026Q2', ticker: 'NVDA', speaker_role: 'CEO', section: 'Prepared Remarks', sentiment_score: 0.88, guidance_upgrade_prob: 0.94, extracted_excerpt: 'Demand for Blackwell architecture is unprecedented across hyperscale cloud providers.' },
      { call_id: 'NVDA-2026Q2', ticker: 'NVDA', speaker_role: 'CFO', section: 'Q&A', sentiment_score: 0.74, guidance_upgrade_prob: 0.86, extracted_excerpt: 'Gross margins are tracking comfortably above 75% for the remainder of the fiscal year.' },
      { call_id: 'AAPL-2026Q3', ticker: 'AAPL', speaker_role: 'CEO', section: 'Prepared Remarks', sentiment_score: 0.62, guidance_upgrade_prob: 0.71, extracted_excerpt: 'Services revenue reached an all-time record, powered by recurring subscriptions.' },
      { call_id: 'MSFT-2026Q4', ticker: 'MSFT', speaker_role: 'CFO', section: 'Q&A', sentiment_score: 0.69, guidance_upgrade_prob: 0.82, extracted_excerpt: 'Azure growth re-accelerated to 31% constant currency with strong AI monetization.' },
    ],
    querySnippet: `# LOAD EARNINGS CALL SENTIMENT EMBEDDINGS
from deshaw_nlp import TranscriptEngine

engine = TranscriptEngine()
scores = engine.get_quarterly_tone(
    tickers=["NVDA", "AAPL", "MSFT", "AMZN"],
    quarters=["2026Q1", "2026Q2"],
    min_confidence=0.85
)
for item in scores:
    print(f"{item.ticker} ({item.quarter}): Net Tone={item.net_sentiment:+.2f}")`
  },
  {
    id: 'ds-fix-tca',
    name: 'FIX Execution TCA & Venue Slippage Blotter',
    identifier: 'fix_execution_tca_blotter',
    category: 'execution-tca',
    categoryLabel: 'Execution & Trade Logs',
    description: 'Post-trade transaction cost analysis (TCA), child slice arrival price slippage, exchange fee rebates, and order routing latency logs across all electronic venues.',
    provider: 'DE Shaw Systematic OMS / FIX 4.4 Engine',
    colocation: 'NY4 Cross-Connect (Internal FIX Engine)',
    frequency: 'Real-Time Streaming',
    format: 'Apache Iceberg',
    size: '760 GB',
    rowCount: '52M executions',
    completeness: '100.00%',
    lastUpdated: 'Live Streaming (0.12s ago)',
    isLiveStream: true,
    latency: '0.12s',
    tags: ['FIX 4.4', 'TCA', 'Slippage', 'Dark Pools', 'Compliance'],
    schema: [
      { name: 'clordid', type: 'string', nullable: false, isKey: true, description: 'Unique FIX Client Order Identifier' },
      { name: 'timestamp', type: 'timestamp_ns', nullable: false, description: 'Fill execution timestamp' },
      { name: 'ticker', type: 'string', nullable: false, description: 'Executed security symbol' },
      { name: 'side', type: 'string', nullable: false, description: 'BUY or SELL' },
      { name: 'shares_filled', type: 'int32', nullable: false, description: 'Number of shares filled on this slice' },
      { name: 'fill_price', type: 'float64', nullable: false, description: 'Net executed price per share' },
      { name: 'arrival_price', type: 'float64', nullable: false, description: 'Mid-price at the instant parent order was released' },
      { name: 'slippage_bps', type: 'float32', nullable: false, description: 'Implementation shortfall in basis points' },
      { name: 'venue', type: 'string', nullable: false, description: 'Execution routing venue (SIGMA-X, CROSSFINDER, DIRECT-EDGE)' },
    ],
    sampleData: [
      { clordid: 'ORD-20260910-8819', timestamp: '10:42:01.094', ticker: 'NVDA', side: 'SELL', shares_filled: 2500, fill_price: 124.52, arrival_price: 124.51, slippage_bps: -0.8, venue: 'SIGMA-X (Dark)' },
      { clordid: 'ORD-20260910-8820', timestamp: '10:42:01.120', ticker: 'UNH', side: 'BUY', shares_filled: 600, fill_price: 572.24, arrival_price: 572.25, slippage_bps: -0.2, venue: 'CROSSFINDER (Dark)' },
      { clordid: 'ORD-20260910-8821', timestamp: '10:42:01.144', ticker: 'JPM', side: 'BUY', shares_filled: 1200, fill_price: 204.31, arrival_price: 204.30, slippage_bps: 0.5, venue: 'XNYS (Lit DMA)' },
      { clordid: 'ORD-20260910-8822', timestamp: '10:42:01.189', ticker: 'AAPL', side: 'SELL', shares_filled: 3400, fill_price: 220.16, arrival_price: 220.16, slippage_bps: 0.0, venue: 'IEX (Midpoint)' },
    ],
    querySnippet: `# TCA SLIPPAGE AUDIT QUERY IN PYTHON
from deshaw_tca import BlotterReader

reader = BlotterReader()
tca_summary = reader.calculate_shortfall(
    date="2026-09-10",
    venue_filter=["SIGMA-X", "CROSSFINDER", "IEX", "XNYS"]
)
print(f"Average Implementation Slippage: {tca_summary.avg_slippage_bps:.2f} bps")
print(f"Dark Pool Fill Ratio: {tca_summary.dark_pool_fill_ratio:.1%}")`
  },
  {
    id: 'ds-options-vol',
    name: 'OPRA Options Implied Volatility Surfaces',
    identifier: 'options_implied_vol_surfaces',
    category: 'factor-alpha',
    categoryLabel: 'Factor & Alpha Signals',
    description: 'Calibrated Black-Scholes and SABR implied volatility surfaces, skewness curves, and second-order Greeks across 500 US equity underlying options chains.',
    provider: 'OPRA Direct + Cboe LiveVol',
    colocation: 'NY4 Equinix (OPRA BBO Processor)',
    frequency: '1-Minute Calibrated Snapshots',
    format: 'Parquet',
    size: '2.3 TB',
    rowCount: '410M contract snapshots',
    completeness: '99.995%',
    lastUpdated: '1 min ago',
    isLiveStream: true,
    latency: '0.11 ms',
    tags: ['Options', 'Implied Vol', 'Greeks', 'OPRA', 'SABR'],
    schema: [
      { name: 'underlying_ticker', type: 'string', nullable: false, isKey: true, description: 'Underlying equity ticker' },
      { name: 'expiration_date', type: 'date32', nullable: false, isKey: true, description: 'Option contract expiration' },
      { name: 'strike_price', type: 'float64', nullable: false, isKey: true, description: 'Option strike in USD' },
      { name: 'option_type', type: 'string', nullable: false, description: 'CALL or PUT' },
      { name: 'implied_vol_pct', type: 'float32', nullable: false, description: 'Calibrated annual implied volatility' },
      { name: 'delta', type: 'float32', nullable: false, description: 'First-order price sensitivity (Greeks delta)' },
      { name: 'gamma', type: 'float32', nullable: false, description: 'Rate of change of delta' },
      { name: 'vega', type: 'float32', nullable: false, description: 'Sensitivity to 1% move in volatility' },
    ],
    sampleData: [
      { underlying_ticker: 'NVDA', expiration_date: '2026-10-18', strike_price: 125.0, option_type: 'CALL', implied_vol_pct: 44.8, delta: 0.52, gamma: 0.042, vega: 0.28 },
      { underlying_ticker: 'NVDA', expiration_date: '2026-10-18', strike_price: 120.0, option_type: 'PUT', implied_vol_pct: 47.2, delta: -0.38, gamma: 0.038, vega: 0.26 },
      { underlying_ticker: 'AAPL', expiration_date: '2026-10-18', strike_price: 220.0, option_type: 'CALL', implied_vol_pct: 21.4, delta: 0.51, gamma: 0.055, vega: 0.34 },
      { underlying_ticker: 'SPY', expiration_date: '2026-09-30', strike_price: 550.0, option_type: 'PUT', implied_vol_pct: 14.8, delta: -0.32, gamma: 0.062, vega: 0.48 },
    ],
    querySnippet: `# PULL VOLATILITY SURFACE SMILE
import numpy as np
from deshaw_vol import VolSurfaceEngine

engine = VolSurfaceEngine()
smile = engine.get_smile(ticker="NVDA", tenor="30d")
print("NVDA 25-Delta Put Vol:", smile.iv_25d_put)
print("NVDA 25-Delta Call Vol:", smile.iv_25d_call)
print("Volatility Skew (Put - Call):", smile.skew_25d)`
  },
];

interface DataRepositoryViewProps {
  onNavigateToOverview?: () => void;
  onOpenAgentModal?: (query?: string) => void;
  onSelectTab?: (tab: ViewTab) => void;
}

export const DataRepositoryView: React.FC<DataRepositoryViewProps> = ({
  onNavigateToOverview,
  onOpenAgentModal,
  onSelectTab,
}) => {
  const { isDegradationDemoRunning, models, setSelectedNodeId } = useFailureState();
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('ds-us-l2-depth');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeInspectorTab, setActiveInspectorTab] = useState<'preview' | 'schema' | 'code' | 'lineage'>('preview');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [showIngestModal, setShowIngestModal] = useState<boolean>(false);
  const [ingestSuccess, setIngestSuccess] = useState<boolean>(false);
  const [newDsName, setNewDsName] = useState<string>('');
  const [newDsIdentifier, setNewDsIdentifier] = useState<string>('');
  const [newDsCategory, setNewDsCategory] = useState<string>('market-depth');
  const [newDsFormat, setNewDsFormat] = useState<string>('Parquet');

  // Compute live dataset statuses with failure states
  const enrichedDatasets = useMemo(() => {
    return MOCK_DATASETS.map((ds) => {
      if (ds.id === 'ds-options-vol' && isDegradationDemoRunning) {
        return {
          ...ds,
          feedHealth: 'DELAYED' as 'LIVE' | 'DELAYED' | 'DOWN',
          lastUpdated: '28m ago (SLA: 15m breach)',
          stalenessReason: 'Broker OPRA bridge queue backlog > 120,000 messages',
          affectedNodes: ['node-6', 'node-2'],
        };
      }
      if (ds.id === 'ds-sec-xbrl' && isDegradationDemoRunning) {
        return {
          ...ds,
          feedHealth: 'DELAYED' as 'LIVE' | 'DELAYED' | 'DOWN',
          lastUpdated: '35m ago (ETL Parser Timeout)',
          stalenessReason: '10-Q schema mismatch on footnote 14 free cash flow disclosures',
          affectedNodes: ['node-4'],
        };
      }
      return {
        ...ds,
        feedHealth: 'LIVE' as 'LIVE' | 'DELAYED' | 'DOWN',
      };
    });
  }, [isDegradationDemoRunning]);

  const selectedDataset = useMemo(() => {
    return enrichedDatasets.find(d => d.id === selectedDatasetId) || enrichedDatasets[0];
  }, [enrichedDatasets, selectedDatasetId]);

  // Filter datasets
  const filteredDatasets = useMemo(() => {
    return enrichedDatasets.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch = searchQuery.trim() === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [enrichedDatasets, activeCategory, searchQuery]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedDataset.querySnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExportSample = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2500);
    }, 600);
  };

  const handleAddDatasetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDsName.trim()) return;
    setIngestSuccess(true);
    setTimeout(() => {
      setIngestSuccess(false);
      setShowIngestModal(false);
      setNewDsName('');
      setNewDsIdentifier('');
    }, 1200);
  };

  return (
    <div className="h-full flex-1 flex flex-col min-h-0 overflow-hidden space-y-2 select-none">
      {/* =========================================================================
          TOP STATS & HEADER BAR
         ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between pb-1.5 border-b border-border gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-blue-400/40 flex items-center justify-center text-blue-600 shadow-2xs">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-foreground font-mono tracking-tight flex items-center gap-2">
              <span>Quantitative Data Repository</span>
              <Badge variant="outline" className="text-[10px] font-mono border-blue-400/50 text-blue-600 bg-white">
                NY4 Colocation
              </Badge>
            </h1>
            <p className="text-[11px] text-muted-foreground font-mono">
              Institutional data catalog, low-latency market depth, factor matrices, and execution archives.
            </p>
          </div>
        </div>

        {/* Global Live Feeds Telemetry */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <div className="hidden md:flex items-center gap-3 px-3 py-1 rounded-lg border border-border bg-white shadow-2xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span>NY4 Tick: <strong className="text-foreground">0.04 ms</strong></span>
            </span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Server className="w-3 h-3 text-blue-500" />
              <span>CME Aurora: <strong className="text-foreground">0.08 ms</strong></span>
            </span>
            <span className="text-border">|</span>
            <span className="text-muted-foreground">
              Capacity: <strong className="text-emerald-700 dark:text-emerald-400">11.5 TB Active</strong>
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowIngestModal(true)}
            className="h-8 font-mono text-xs gap-1.5 border-blue-400/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Connect Feed / Ingest</span>
            <span className="sm:hidden">Ingest</span>
          </Button>
        </div>
      </div>

      {/* =========================================================================
          MAIN WORKSPACE LAYOUT: Master List (Left) + Schema Inspector (Right)
         ========================================================================= */}
      <div className="flex-1 min-h-0 border border-border rounded-xl bg-white shadow-xs overflow-hidden flex flex-col">
        <ResizableSplit
          direction="horizontal"
          initialSizes={[33, 67]}
          minSizes={[22, 35]}
          storageKey="data_repository_view_split"
          className="h-full"
        >
          {/* =========================================================================
              LEFT COLUMN: DATASET CATALOG & FILTERS
             ========================================================================= */}
          <div className="border-r border-border p-3 flex flex-col justify-between bg-white min-h-0 overflow-hidden h-full">
          <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
            
            {/* Search Bar */}
            <div className="relative mb-2 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search datasets, tickers, schemas..."
                className="pl-8 h-8 text-xs font-mono bg-white border-border"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 mb-2.5 overflow-x-auto pb-1 shrink-0 scrollbar-none text-[10px] font-mono">
              {[
                { id: 'all', label: 'All (7)' },
                { id: 'market-depth', label: 'Market Depth' },
                { id: 'factor-alpha', label: 'Alpha Factors' },
                { id: 'alternative-nlp', label: 'Alt & NLP' },
                { id: 'execution-tca', label: 'TCA Logs' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2 py-1 rounded-md whitespace-nowrap transition-colors border ${
                    activeCategory === cat.id
                      ? 'bg-primary text-primary-foreground font-bold border-primary shadow-2xs'
                      : 'bg-white text-muted-foreground hover:text-foreground border-border hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Catalog List */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2">
              {filteredDatasets.map((ds) => {
                const isSelected = ds.id === selectedDatasetId;
                return (
                  <div
                    key={ds.id}
                    onClick={() => setSelectedDatasetId(ds.id)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-400/70 shadow-xs ring-1 ring-blue-400/30'
                        : 'bg-white hover:bg-slate-50 border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white text-primary border border-border">
                        {ds.categoryLabel}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] font-mono">
                        {ds.feedHealth === 'DELAYED' ? (
                          <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            DELAYED
                          </span>
                        ) : ds.feedHealth === 'DOWN' ? (
                          <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            DOWN
                          </span>
                        ) : ds.isLiveStream ? (
                          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            LIVE
                          </span>
                        ) : (
                          <span className="text-muted-foreground">{ds.frequency.split(' ')[0]}</span>
                        )}
                        <span className="text-border">·</span>
                        <span className="text-muted-foreground">{ds.size}</span>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-foreground tracking-tight flex items-center justify-between">
                      <span>{ds.name}</span>
                      {isSelected && <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </div>

                    <div className="text-[10px] font-mono text-muted-foreground mt-0.5 truncate">
                      {ds.identifier}
                    </div>

                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {ds.description}
                    </p>

                    {ds.affectedNodes && ds.affectedNodes.length > 0 && (
                      <div className="mt-1.5 p-1.5 rounded-md bg-amber-50/70 border border-amber-200 text-[9.5px] font-mono flex items-center justify-between">
                        <span className="text-amber-800 font-semibold">Affects {ds.affectedNodes.length} Agent Node(s)</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNodeId(ds.affectedNodes![0]);
                            if (onSelectTab) onSelectTab('agent-builder');
                          }}
                          className="px-1.5 py-0.5 rounded bg-white border border-amber-300 text-amber-900 font-bold hover:bg-amber-100 transition-all text-[9px]"
                        >
                          Inspect Node ↗
                        </button>
                      </div>
                    )}

                    <div className="mt-2 pt-1.5 border-t border-border/50 flex items-center justify-between text-[9px] font-mono text-muted-foreground">
                      <span>Format: <strong>{ds.format}</strong></span>
                      <span>Quality: <strong className={ds.feedHealth === 'DELAYED' ? 'text-amber-700 font-bold' : 'text-emerald-700'}>{ds.completeness}</strong></span>
                    </div>
                  </div>
                );
              })}

              {filteredDatasets.length === 0 && (
                <div className="py-8 text-center text-xs font-mono text-muted-foreground">
                  No datasets matching filter criteria.
                </div>
              )}
            </div>
          </div>

          {/* Quick Info footer */}
          <div className="pt-2 border-t border-border text-[10px] font-mono text-muted-foreground flex items-center justify-between shrink-0">
            <span>Storage: Hot NVMe Lakehouse</span>
            <span className="text-emerald-700 font-semibold">SLA: 99.999%</span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: DATASET SCHEMA, PREVIEW & CODE INSPECTOR
           ========================================================================= */}
        <div className="flex flex-col min-h-0 bg-white overflow-hidden h-full">
          
          {/* Header & Tabs for Selected Dataset */}
          <div className="p-3 sm:p-4 border-b border-border bg-white flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-foreground font-mono truncate">
                  {selectedDataset.name}
                </h2>
                <Badge variant="outline" className="text-[10px] font-mono border-border text-foreground bg-white">
                  {selectedDataset.format}
                </Badge>
                {selectedDataset.latency && (
                  <Badge variant="outline" className="text-[10px] font-mono bg-white text-emerald-700 border-emerald-300">
                    {selectedDataset.latency}
                  </Badge>
                )}
              </div>
              <div className="text-[11px] font-mono text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span>ID: <code className="text-foreground">{selectedDataset.identifier}</code></span>
                <span>Rows: <strong className="text-foreground">{selectedDataset.rowCount}</strong></span>
                <span>Colocation: <strong className="text-foreground">{selectedDataset.colocation}</strong></span>
              </div>
            </div>

            {/* Action Buttons: Query in Agent, Export */}
            <div className="flex items-center gap-1.5 font-mono">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (onOpenAgentModal) {
                    onOpenAgentModal(`Query ${selectedDataset.identifier} and verify recent signals`);
                  }
                }}
                className="h-8 text-xs gap-1.5 border-blue-400/50 bg-white hover:bg-blue-50 text-blue-700 shadow-2xs"
                title="Send query to Systematic Agent"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Ask Agent</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportSample}
                disabled={isExporting}
                className="h-8 text-xs gap-1.5 border-border bg-white hover:bg-slate-50 text-foreground shadow-2xs"
                title="Download sample dataset slice in CSV format"
              >
                {exportSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Exported</span>
                  </>
                ) : (
                  <>
                    <ArrowDownToLine className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="hidden sm:inline">Export Sample</span>
                    <span className="sm:hidden">Export</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sub-Tabs: Preview, Schema, Python SDK, Lineage */}
          <div className="px-3 sm:px-4 py-1.5 border-b border-border bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1 text-xs font-mono">
              {[
                { id: 'preview', label: 'Live Data Preview', icon: Table },
                { id: 'schema', label: `Schema (${selectedDataset.schema.length} cols)`, icon: SlidersHorizontal },
                { id: 'code', label: 'Python / SDK Query', icon: Code2 },
                { id: 'lineage', label: 'Pipeline & Lineage', icon: Layers },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeInspectorTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveInspectorTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                      isActive
                        ? 'bg-white text-primary font-bold shadow-2xs border border-border'
                        : 'text-muted-foreground hover:text-foreground hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            <span className="text-[10px] font-mono text-muted-foreground hidden md:inline">
              Updated: {selectedDataset.lastUpdated}
            </span>
          </div>

          {/* Content Pane */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 bg-white">
            
            {/* 1. LIVE DATA PREVIEW TAB */}
            {activeInspectorTab === 'preview' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>Showing latest records from partition: <code className="text-foreground">date=2026-09-10</code></span>
                  <span className="text-emerald-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Real-time Buffer Synced
                  </span>
                </div>

                <div className="border border-border rounded-xl overflow-hidden shadow-2xs bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono border-collapse">
                      <thead>
                        <tr className="bg-white border-b border-border text-[11px] text-muted-foreground">
                          {selectedDataset.schema.map((col) => (
                            <th key={col.name} className="px-3 py-2 font-semibold whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <span>{col.name}</span>
                                {col.isKey && <span className="text-amber-500 font-bold" title="Primary Key">★</span>}
                              </div>
                              <span className="text-[9px] text-muted-foreground/80 font-normal">{col.type}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {selectedDataset.sampleData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            {selectedDataset.schema.map((col) => {
                              const val = row[col.name];
                              const isNumeric = typeof val === 'number';
                              return (
                                <td key={col.name} className="px-3 py-2 whitespace-nowrap text-foreground">
                                  {isNumeric ? (
                                    val.toLocaleString(undefined, { maximumFractionDigits: 4 })
                                  ) : (
                                    val !== undefined ? String(val) : <span className="text-muted-foreground/40 italic">null</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
                  <span>Displaying 1-{selectedDataset.sampleData.length} sample rows of {selectedDataset.rowCount}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectTab && onSelectTab('agent-builder')}
                      className="h-6 text-[10px] font-mono text-blue-600 hover:text-blue-700 hover:bg-slate-50"
                    >
                      Connect in Agent Workspace Canvas →
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SCHEMA DEFINITION TAB */}
            {activeInspectorTab === 'schema' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>Arrow / Parquet Type Declarations &amp; Nullability</span>
                  <Badge variant="outline" className="text-[10px] font-mono bg-white">
                    Schema v2.4
                  </Badge>
                </div>

                <div className="border border-border rounded-xl overflow-hidden shadow-2xs bg-white">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="bg-white border-b border-border text-[11px] text-muted-foreground">
                        <th className="px-3.5 py-2 font-semibold">Field Name</th>
                        <th className="px-3.5 py-2 font-semibold">Data Type</th>
                        <th className="px-3.5 py-2 font-semibold">Nullable</th>
                        <th className="px-3.5 py-2 font-semibold">Constraints</th>
                        <th className="px-3.5 py-2 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {selectedDataset.schema.map((col) => (
                        <tr key={col.name} className="hover:bg-slate-50 transition-colors">
                          <td className="px-3.5 py-2.5 font-bold text-foreground flex items-center gap-1.5">
                            <code>{col.name}</code>
                            {col.isKey && (
                              <Badge variant="outline" className="text-[9px] px-1 py-0 bg-amber-50 text-amber-700 border-amber-400/40">
                                PK
                              </Badge>
                            )}
                          </td>
                          <td className="px-3.5 py-2.5">
                            <span className="px-1.5 py-0.5 rounded bg-white border border-border font-semibold text-primary text-[10px]">
                              {col.type}
                            </span>
                          </td>
                          <td className="px-3.5 py-2.5 text-muted-foreground">
                            {col.nullable ? 'YES' : <strong className="text-foreground">NOT NULL</strong>}
                          </td>
                          <td className="px-3.5 py-2.5 text-muted-foreground">
                            {col.isKey ? 'Indexed / Partition' : 'Standard'}
                          </td>
                          <td className="px-3.5 py-2.5 text-muted-foreground text-[11px]">
                            {col.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. PYTHON / SDK QUERY CODE TAB */}
            {activeInspectorTab === 'code' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">
                    Native Python SDK / Arrow Dataset Connector
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    className="h-7 text-xs font-mono gap-1.5 border-border bg-white hover:bg-slate-50 shadow-none"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-muted-foreground" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="relative rounded-xl border border-border bg-white p-4 font-mono text-xs overflow-x-auto text-foreground shadow-2xs">
                  <pre className="leading-relaxed">
                    <code>{selectedDataset.querySnippet}</code>
                  </pre>
                </div>

                <div className="p-3 rounded-lg border border-border bg-white text-xs font-mono space-y-1 text-muted-foreground">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-blue-600" />
                    <span>Connection URI:</span>
                  </div>
                  <p className="text-[11px] bg-white p-2 rounded border border-border select-all text-foreground font-semibold">
                    arrow-flight://ny4.eqx.deshaw.internal:8815/repo/{selectedDataset.identifier}?compression=zstd
                  </p>
                </div>
              </div>
            )}

            {/* 4. DATA PIPELINE & LINEAGE TAB */}
            {activeInspectorTab === 'lineage' && (
              <div className="space-y-3">
                <div className="text-xs font-mono text-muted-foreground">
                  Ingestion Topology &amp; Colocation Routing Architecture
                </div>

                {/* Pipeline Flow Diagram */}
                <div className="p-4 rounded-xl border border-border bg-white space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-center text-xs font-mono">
                    <div className="p-3 rounded-lg border border-blue-400/40 bg-blue-50/40">
                      <Radio className="w-4 h-4 text-blue-600 mx-auto mb-1 animate-pulse" />
                      <div className="font-bold text-foreground">1. Source Origin</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{selectedDataset.provider}</div>
                      <Badge variant="outline" className="text-[9px] mt-1.5 bg-white">Raw Multicast</Badge>
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-white shadow-2xs">
                      <Server className="w-4 h-4 text-primary mx-auto mb-1" />
                      <div className="font-bold text-foreground">2. Gateway Normalizer</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">NY4 Low-Latency Parser</div>
                      <Badge variant="outline" className="text-[9px] mt-1.5 bg-white">&lt;0.02ms Latency</Badge>
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-white shadow-2xs">
                      <HardDrive className="w-4 h-4 text-primary mx-auto mb-1" />
                      <div className="font-bold text-foreground">3. Hot Lakehouse</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">Arrow IPC / Parquet</div>
                      <Badge variant="outline" className="text-[9px] mt-1.5 bg-white">ZSTD Compressed</Badge>
                    </div>

                    <div className="p-3 rounded-lg border border-emerald-400/40 bg-emerald-50/40">
                      <Sparkles className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                      <div className="font-bold text-foreground">4. Systematic Agent</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">Autonomous Rebalancer</div>
                      <Badge variant="outline" className="text-[9px] mt-1.5 text-emerald-600 bg-white">Active Consumer</Badge>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-border text-xs font-mono space-y-1.5 shadow-2xs">
                    <div className="font-bold text-foreground flex items-center justify-between">
                      <span>Data Quality Verifications</span>
                      <span className="text-emerald-700 font-semibold">{selectedDataset.completeness} Verified</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-muted-foreground pt-1">
                      <div>✓ Missing ticks: &lt; 0.001%</div>
                      <div>✓ Timestamp monotonicity: PASSED</div>
                      <div>✓ Outlier price band: PASSED</div>
                      <div>✓ Cross-exchange arbitrage: ZERO</div>
                      <div>✓ Checksum verification: PASSED</div>
                      <div>✓ Disaster recovery replica: SEC-B</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        </ResizableSplit>
      </div>

      {/* =========================================================================
          CONNECT FEED / INGEST MODAL
         ========================================================================= */}
      {showIngestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowIngestModal(false)}
          />

          <Card className="relative w-full max-w-lg bg-white border-2 border-blue-400/60 rounded-2xl shadow-2xl z-10 p-5 font-mono text-xs space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-border bg-white">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-sm text-foreground">Register New Institutional Dataset</span>
              </div>
              <button 
                onClick={() => setShowIngestModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDatasetSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">Dataset Name</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g., Cboe Volatility Index Minute Snapshots"
                  value={newDsName}
                  onChange={(e) => setNewDsName(e.target.value)}
                  className="font-mono text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">Category</label>
                  <select
                    value={newDsCategory}
                    onChange={(e) => setNewDsCategory(e.target.value as any)}
                    className="w-full h-9 rounded-md border border-border bg-white px-3 py-1 text-xs font-mono text-foreground"
                  >
                    <option value="market-depth">Market & Order Book</option>
                    <option value="factor-alpha">Factor & Alpha Signals</option>
                    <option value="alternative-nlp">Alternative & NLP</option>
                    <option value="execution-tca">Execution & Trade Logs</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">Storage Format</label>
                  <select
                    value={newDsFormat}
                    onChange={(e) => setNewDsFormat(e.target.value as any)}
                    className="w-full h-9 rounded-md border border-border bg-white px-3 py-1 text-xs font-mono text-foreground"
                  >
                    <option value="Parquet">Parquet</option>
                    <option value="Arrow IPC">Arrow IPC</option>
                    <option value="Delta Lake">Delta Lake</option>
                    <option value="Apache Iceberg">Apache Iceberg</option>
                    <option value="ClickHouse">ClickHouse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">Colocation / S3 Stream URI</label>
                <Input
                  type="text"
                  placeholder="s3://deshaw-lakehouse-east/feeds/new_dataset.parquet"
                  className="font-mono text-xs bg-white"
                />
              </div>

              {ingestSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Dataset registered successfully! Verified in catalog.</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border bg-white">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowIngestModal(false)}
                  className="bg-white hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-mono"
                >
                  Register Dataset
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
};
