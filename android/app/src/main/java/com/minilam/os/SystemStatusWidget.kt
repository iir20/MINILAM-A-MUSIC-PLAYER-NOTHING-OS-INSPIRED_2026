package com.minilam.os

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color as ComposeColor
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.layout.Alignment
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.*
import androidx.glance.text.Text
import androidx.glance.background
import androidx.glance.unit.ColorProvider
import androidx.glance.text.TextStyle
import androidx.glance.text.FontWeight
import androidx.glance.text.TextAlign

class SystemStatusWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            GlanceTheme {
                Column(
                    modifier = GlanceModifier
                        .fillMaxSize()
                        .background(ComposeColor.Black)
                        .padding(10.dp)
                ) {
                    // Title Bar
                    Row(
                        modifier = GlanceModifier.fillMaxWidth().padding(bottom = 10.dp),
                        verticalAlignment = Alignment.Vertical.CenterVertically
                    ) {
                        Box(modifier = GlanceModifier.size(3.dp).background(ComposeColor(0xFFFF3B30))) {}
                        Spacer(modifier = GlanceModifier.width(6.dp))
                        Text(
                            text = "DIAGNOSTICS_v1.0",
                            style = TextStyle(color = ColorProvider(ComposeColor.White), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        )
                        Spacer(modifier = GlanceModifier.defaultWeight())
                    }
                    
                    // Stats Grid simulation
                    Column(modifier = GlanceModifier.fillMaxWidth()) {
                        Row(modifier = GlanceModifier.fillMaxWidth()) {
                            StatsBox("CPU", "12%", 0.12f, GlanceModifier.defaultWeight())
                            Spacer(modifier = GlanceModifier.width(8.dp))
                            StatsBox("MEM", "2.4G", 0.35f, GlanceModifier.defaultWeight())
                        }
                        Spacer(modifier = GlanceModifier.height(8.dp))
                        Row(modifier = GlanceModifier.fillMaxWidth()) {
                            StatsBox("BAT", "87%", 0.87f, GlanceModifier.defaultWeight())
                            Spacer(modifier = GlanceModifier.width(8.dp))
                            StatsBox("TMP", "34°C", 0.45f, GlanceModifier.defaultWeight())
                        }
                    }
                    
                    Spacer(modifier = GlanceModifier.defaultWeight())
                    
                    // Bottom environmental status
                    Row(
                        modifier = GlanceModifier.fillMaxWidth().padding(top = 8.dp),
                        verticalAlignment = Alignment.Vertical.CenterVertically
                    ) {
                        Text(
                            text = "ENVIRONMENT // RAIN_EFFECTS_ACTIVE",
                            style = TextStyle(color = ColorProvider(ComposeColor.White.copy(alpha = 0.4f)), fontSize = 7.sp)
                        )
                    }
                }
            }
        }
    }

    @Composable
    private fun StatsBox(label: String, value: String, progress: Float, modifier: GlanceModifier) {
        Box(
            modifier = modifier
                .background(ComposeColor.White.copy(alpha = 0.05f))
                .padding(8.dp)
        ) {
            Column {
                Row(verticalAlignment = Alignment.Vertical.CenterVertically) {
                    Text(text = label, style = TextStyle(color = ColorProvider(ComposeColor.White.copy(alpha = 0.6f)), fontSize = 7.sp))
                    Spacer(modifier = GlanceModifier.defaultWeight())
                    Text(text = value, style = TextStyle(color = ColorProvider(ComposeColor.White), fontSize = 8.sp, fontWeight = FontWeight.Bold))
                }
                Spacer(modifier = GlanceModifier.height(4.dp))
                // Minimal horizontal bar
                Box(
                    modifier = GlanceModifier.fillMaxWidth().height(1.dp).background(ComposeColor.White.copy(alpha = 0.1f))
                ) {
                    Box(
                        modifier = GlanceModifier.fillMaxWidth().height(1.dp).background(ComposeColor(0xFFFF3B30).copy(alpha = 0.6f))
                    ) {}
                }
            }
        }
    }
}
